#!/bin/bash
# Улучшенный деплой фронтенда сайта rayanhalal.ru с проверками
# Использование: ./deploy-site-frontend-SAFE.sh

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
echo -e "${BLUE}🚀 БЕЗОПАСНЫЙ ДЕПЛОЙ ФРОНТЕНДА RAYANHALAL.RU${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Проверка, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ошибка: package.json не найден!${NC}"
    echo -e "${YELLOW}   Запустите скрипт из корня проекта rayansite${NC}"
    exit 1
fi

# Шаг 0: Проверка структуры на сервере
echo -e "${YELLOW}🔍 Шаг 0/6: Проверка структуры на сервере...${NC}"
ssh $SERVER << 'ENDSSH'
    echo "Текущая структура папок:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Папка frontend:"
    ls -la /var/www/www-root/data/www/rayanhalal.ru/frontend/ 2>/dev/null || echo "  (не существует)"
    echo ""
    echo "Папка frontend/build:"
    ls -la /var/www/www-root/data/www/rayanhalal.ru/frontend/build/ 2>/dev/null | head -10 || echo "  (не существует)"
    echo ""
    
    # Проверка на вложенный build/build
    if [ -d "/var/www/www-root/data/www/rayanhalal.ru/frontend/build/build" ]; then
        echo "⚠️  ОБНАРУЖЕН ВЛОЖЕННЫЙ build/build!"
        ls -la /var/www/www-root/data/www/rayanhalal.ru/frontend/build/build/ | head -5
    fi
ENDSSH

echo -e "${GREEN}✅ Проверка завершена${NC}"
echo ""

# Подтверждение
read -p "Продолжить деплой? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Деплой отменён${NC}"
    exit 1
fi

# Шаг 1: Создание бэкапа на сервере
echo -e "${YELLOW}📦 Шаг 1/6: Создание бэкапа на сервере...${NC}"
ssh $SERVER << ENDSSH
    if [ -d "$SITE_FRONTEND_DIR" ] && [ "\$(ls -A $SITE_FRONTEND_DIR 2>/dev/null)" ]; then
        echo "Создаю бэкап: $BACKUP_NAME"
        cd $SITE_FRONTEND_DIR
        tar -czf $BACKUP_DIR/$BACKUP_NAME * 2>/dev/null || true
        echo "✅ Бэкап сохранён: $BACKUP_DIR/$BACKUP_NAME"
        
        # Показать размер бэкапа
        ls -lh $BACKUP_DIR/$BACKUP_NAME
    else
        echo "⚠️  Папка пуста или не существует, бэкап не требуется"
    fi
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при создании бэкапа!${NC}"
    exit 1
fi

# Шаг 2: Сборка фронтенда
echo -e "${YELLOW}🔨 Шаг 2/6: Сборка фронтенда...${NC}"

# Удалить старый build
rm -rf build

# Собрать
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}❌ Ошибка: папка build не создана!${NC}"
    exit 1
fi

# Проверка содержимого build
echo "Содержимое локального build:"
ls -la build/ | head -10

echo -e "${GREEN}✅ Сборка завершена${NC}"

# Шаг 3: Создание архива
echo -e "${YELLOW}📦 Шаг 3/6: Создание архива...${NC}"

# ✅ ВАЖНО: -C build . означает "перейти в build и архивировать ВСЁ без папки build/"
tar -czf site-frontend-build.tar.gz -C build .

if [ ! -f "site-frontend-build.tar.gz" ]; then
    echo -e "${RED}❌ Ошибка: архив не создан!${NC}"
    exit 1
fi

# Показать содержимое архива (первые 10 файлов)
echo "Содержимое архива (первые 10 файлов):"
tar -tzf site-frontend-build.tar.gz | head -10

echo -e "${GREEN}✅ Архив создан${NC}"

# Шаг 4: Отправка на сервер
echo -e "${YELLOW}📤 Шаг 4/6: Отправка на сервер...${NC}"
scp site-frontend-build.tar.gz $SERVER:/tmp/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка при отправке на сервер!${NC}"
    rm site-frontend-build.tar.gz
    exit 1
fi

echo -e "${GREEN}✅ Файлы отправлены${NC}"

# Шаг 5: Деплой на сервере
echo -e "${YELLOW}🚀 Шаг 5/6: Деплой на сервере...${NC}"
ssh $SERVER << 'ENDSSH'
    FRONTEND_DIR="/var/www/www-root/data/www/rayanhalal.ru/frontend/build"
    
    # Создать директорию если не существует
    mkdir -p "$FRONTEND_DIR"
    
    # ✅ КРИТИЧНО: Удалить старые файлы (включая возможный вложенный build/)
    echo "Очистка старых файлов..."
    rm -rf "$FRONTEND_DIR"/*
    
    # Проверка, что папка пустая
    if [ "$(ls -A $FRONTEND_DIR 2>/dev/null)" ]; then
        echo "⚠️  ВНИМАНИЕ: Папка не пустая после очистки!"
        ls -la "$FRONTEND_DIR"
    else
        echo "✅ Папка очищена"
    fi
    
    # Распаковать новый билд
    echo "Распаковка нового билда..."
    tar -xzf /tmp/site-frontend-build.tar.gz -C "$FRONTEND_DIR"
    
    # Проверка содержимого после распаковки
    echo "Содержимое после распаковки (первые 10 файлов):"
    ls -la "$FRONTEND_DIR" | head -10
    
    # ✅ ПРОВЕРКА: Убедиться, что нет вложенного build/build
    if [ -d "$FRONTEND_DIR/build" ]; then
        echo "❌ ОШИБКА: Обнаружен вложенный build/build!"
        echo "Перемещаю файлы..."
        mv "$FRONTEND_DIR/build"/* "$FRONTEND_DIR/"
        rm -rf "$FRONTEND_DIR/build"
        echo "✅ Исправлено"
    fi
    
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

# Шаг 6: Проверка финальной структуры
echo -e "${YELLOW}🔍 Шаг 6/6: Финальная проверка...${NC}"
ssh $SERVER << 'ENDSSH'
    echo "Финальная структура:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    ls -la /var/www/www-root/data/www/rayanhalal.ru/frontend/build/ | head -15
    
    # Проверка ключевых файлов
    echo ""
    echo "Проверка ключевых файлов:"
    if [ -f "/var/www/www-root/data/www/rayanhalal.ru/frontend/build/index.html" ]; then
        echo "✅ index.html найден"
    else
        echo "❌ index.html НЕ НАЙДЕН!"
    fi
    
    if [ -d "/var/www/www-root/data/www/rayanhalal.ru/frontend/build/static" ]; then
        echo "✅ Папка static найдена"
    else
        echo "❌ Папка static НЕ НАЙДЕНА!"
    fi
ENDSSH

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
echo -e "${YELLOW}   cd $SITE_FRONTEND_DIR${NC}"
echo -e "${YELLOW}   rm -rf *${NC}"
echo -e "${YELLOW}   tar -xzf $BACKUP_DIR/$BACKUP_NAME${NC}"
echo ""

