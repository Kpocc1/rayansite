#!/bin/bash
# Деплой фронтенда сайта rayanhalal.ru с автоматическим бэкапом
# Использование: ./deploy-site-frontend.sh

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Настройки
SERVER="root@45.141.101.44"
SITE_FRONTEND_DIR="/var/www/www-root/data/www/rayanhalal.ru/frontend/build"
BACKUP_DIR="/var/www/www-root/data/www/rayanhalal.ru"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BACKUP_NAME="frontend_build_backup_${TIMESTAMP}.tar.gz"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🚀 ДЕПЛОЙ ФРОНТЕНДА САЙТА RAYANHALAL.RU${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Проверка, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ошибка: package.json не найден!${NC}"
    echo -e "${YELLOW}   Запустите скрипт из корня проекта rayansite${NC}"
    exit 1
fi

# Шаг 1: Создание бэкапа на сервере
echo -e "${YELLOW}📦 Шаг 1/5: Создание бэкапа на сервере...${NC}"
ssh $SERVER << ENDSSH
    if [ -d "$SITE_FRONTEND_DIR" ] && [ "\$(ls -A $SITE_FRONTEND_DIR 2>/dev/null)" ]; then
        echo "Создаю бэкап: $BACKUP_NAME"
        cd $SITE_FRONTEND_DIR
        tar -czf $BACKUP_DIR/$BACKUP_NAME * 2>/dev/null || true
        echo "✅ Бэкап сохранён: $BACKUP_DIR/$BACKUP_NAME"
    else
        echo "⚠️  Папка пуста или не существует, бэкап не требуется"
    fi
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при создании бэкапа!${NC}"
    exit 1
fi

# Шаг 2: Сборка фронтенда
echo -e "${YELLOW}🔨 Шаг 2/5: Сборка фронтенда...${NC}"

# Удалить старый build
rm -rf build

# Собрать
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}❌ Ошибка: папка build не создана!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Сборка завершена${NC}"

# Шаг 3: Создание архива
echo -e "${YELLOW}📦 Шаг 3/5: Создание архива...${NC}"
tar -czf site-frontend-build.tar.gz -C build .

if [ ! -f "site-frontend-build.tar.gz" ]; then
    echo -e "${RED}❌ Ошибка: архив не создан!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Архив создан${NC}"

# Шаг 4: Отправка на сервер
echo -e "${YELLOW}📤 Шаг 4/5: Отправка на сервер...${NC}"
scp site-frontend-build.tar.gz $SERVER:/tmp/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при отправке на сервер!${NC}"
    rm site-frontend-build.tar.gz
    exit 1
fi

echo -e "${GREEN}✅ Файлы отправлены${NC}"

# Шаг 5: Деплой на сервере
echo -e "${YELLOW}🚀 Шаг 5/5: Деплой на сервере...${NC}"
ssh $SERVER << 'ENDSSH'
    FRONTEND_DIR="/var/www/www-root/data/www/rayanhalal.ru/frontend/build"
    
    # Создать директорию если не существует
    mkdir -p "$FRONTEND_DIR"
    
    # Удалить старые файлы
    echo "Очистка старых файлов..."
    rm -rf "$FRONTEND_DIR"/*
    
    # Распаковать новый билд
    echo "Распаковка нового билда..."
    tar -xzf /tmp/site-frontend-build.tar.gz -C "$FRONTEND_DIR"
    
    # Удалить временный архив
    rm /tmp/site-frontend-build.tar.gz
    
    # Установить правильные права
    echo "Установка прав доступа..."
    chown -R www-data:www-data "$FRONTEND_DIR"
    chmod -R 755 "$FRONTEND_DIR"
    
    echo "✅ Деплой завершён!"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при деплое на сервере!${NC}"
    rm site-frontend-build.tar.gz
    exit 1
fi

# Очистка локального архива
echo -e "${YELLOW}🧹 Очистка...${NC}"
rm site-frontend-build.tar.gz

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ ДЕПЛОЙ ЗАВЕРШЁН УСПЕШНО!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}🌐 Проверь сайт: https://rayanhalal.ru${NC}"
echo -e "${BLUE}📁 Бэкап: $BACKUP_DIR/$BACKUP_NAME${NC}"
echo ""
echo -e "${YELLOW}📋 Команды для отката:${NC}"
echo -e "${YELLOW}   ssh $SERVER${NC}"
echo -e "${YELLOW}   cd $BACKUP_DIR${NC}"
echo -e "${YELLOW}   ./rollback-site-frontend.sh $BACKUP_NAME${NC}"
echo ""

