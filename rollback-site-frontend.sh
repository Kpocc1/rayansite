#!/bin/bash
# Откат фронтенда сайта rayanhalal.ru к предыдущей версии
# Использование: ./rollback-site-frontend.sh [имя_бэкапа]
# Пример: ./rollback-site-frontend.sh frontend_build_backup_20251020185706.tar.gz

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER="root@45.141.101.44"
BACKUP_DIR="/var/www/www-root/data/www/rayanhalal.ru"
FRONTEND_DIR="/var/www/www-root/data/www/rayanhalal.ru/frontend/build"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}⏮️  ОТКАТ ФРОНТЕНДА САЙТА${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Проверка параметра
if [ -z "$1" ]; then
    echo -e "${YELLOW}Список доступных бэкапов на сервере:${NC}"
    echo ""
    ssh $SERVER "ls -lth $BACKUP_DIR/frontend_build_backup_*.tar.gz 2>/dev/null | head -10" || echo -e "${RED}Бэкапы не найдены!${NC}"
    echo ""
    echo -e "${YELLOW}Использование:${NC}"
    echo -e "  ${GREEN}./rollback-site-frontend.sh frontend_build_backup_YYYYMMDDHHMMSS.tar.gz${NC}"
    echo ""
    exit 1
fi

BACKUP_FILE=$1

echo -e "${YELLOW}🔍 Проверка бэкапа: $BACKUP_FILE${NC}"

# Проверка существования бэкапа
ssh $SERVER "test -f $BACKUP_DIR/$BACKUP_FILE"
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка: Бэкап $BACKUP_FILE не найден на сервере!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Бэкап найден${NC}"
echo ""
echo -e "${RED}⚠️  ВНИМАНИЕ! Текущая версия сайта будет заменена на версию из бэкапа!${NC}"
echo -e "${YELLOW}   Бэкап: $BACKUP_FILE${NC}"
echo ""
read -p "Продолжить? (yes/no): " -r
echo

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${YELLOW}Откат отменён${NC}"
    exit 0
fi

# Создание бэкапа текущей версии
TIMESTAMP=$(date +%Y%m%d%H%M%S)
CURRENT_BACKUP="frontend_build_before_rollback_${TIMESTAMP}.tar.gz"

echo -e "${YELLOW}📦 Создание бэкапа текущей версии...${NC}"
ssh $SERVER << ENDSSH
    cd $FRONTEND_DIR
    if [ "\$(ls -A)" ]; then
        tar -czf $BACKUP_DIR/$CURRENT_BACKUP * 2>/dev/null || true
        echo "✅ Текущая версия сохранена: $CURRENT_BACKUP"
    fi
ENDSSH

# Откат
echo -e "${YELLOW}⏮️  Откат к версии из бэкапа...${NC}"
ssh $SERVER << ENDSSH
    # Очистить текущую директорию
    echo "Очистка текущих файлов..."
    rm -rf $FRONTEND_DIR/*
    
    # Распаковать бэкап
    echo "Распаковка бэкапа..."
    tar -xzf $BACKUP_DIR/$BACKUP_FILE -C $FRONTEND_DIR
    
    # Установить права
    echo "Установка прав доступа..."
    chown -R www-data:www-data $FRONTEND_DIR
    chmod -R 755 $FRONTEND_DIR
    
    echo "✅ Откат завершён!"
ENDSSH

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ОТКАТ ВЫПОЛНЕН УСПЕШНО!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${BLUE}🌐 Проверь сайт: https://rayanhalal.ru${NC}"
    echo -e "${BLUE}📁 Предыдущая версия сохранена: $CURRENT_BACKUP${NC}"
    echo ""
else
    echo -e "${RED}❌ Ошибка при откате!${NC}"
    exit 1
fi

