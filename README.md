# VKRansible Refactored

Чистая версия проекта с разделением ролей и playbook-ов.

## Что изменено

- `common` оставляет только базовую подготовку узлов: SSH, UFW, базовые утилиты и обновление пакетов.
- Веб-часть разделена на `web_packages` и `web_deploy`.
- База данных разделена на `db_packages` и `db_deploy`.
- `web_packages` ставит не только веб-пакеты, но и клиентские пакеты для работы веб-узла с PostgreSQL (`php-pgsql`, `postgresql-client`).
- `db_packages` ставит только пакеты PostgreSQL и зависимости самого DB-сервера.
- Убрана жёсткая привязка к конкретным версиям PHP-FPM и PostgreSQL: версии определяются на узле автоматически.
- `site.yml` исправлен и теперь корректно импортирует сценарии.
- Бэкап веб-узла использует `web_root`, чтобы архивировался реальный каталог сайта.

## Порядок запуска

```bash
ansible-playbook -i inventories/lab/hosts.yml full.yml
ansible-playbook -i inventories/lab/hosts.yml playbooks/backup.yml
```

## Отдельные прогоны

```bash
ansible-playbook -i inventories/lab/hosts.yml playbooks/common.yml
ansible-playbook -i inventories/lab/hosts.yml playbooks/web_packages.yml
ansible-playbook -i inventories/lab/hosts.yml playbooks/web_deploy.yml
ansible-playbook -i inventories/lab/hosts.yml playbooks/db_packages.yml
ansible-playbook -i inventories/lab/hosts.yml playbooks/db_deploy.yml
ansible-playbook -i inventories/lab/hosts.yml playbooks/files.yml
```

## Важно

- В inventory по умолчанию указан хост `10.39.14.114` с пробросом портов `2201/2202/2203`, как в твоём стенде на скриншоте.
- Если у тебя сервер-хост реально на `10.39.14.11`, просто замени `ansible_host` в `inventories/lab/hosts.yml`.
- Для удалённого доступа к vagrant-ВМ обычно используется ключ `~/.vagrant.d/insecure_private_key`.


- `db_packages` теперь также ставит `postgresql-client` и `php-pgsql` по отдельному требованию.


## Restore latest imported database backup

To restore the latest `dvdrental` dump from Borg back to `db1`:

```bash
ansible-playbook playbooks/db_restore.yml
```
