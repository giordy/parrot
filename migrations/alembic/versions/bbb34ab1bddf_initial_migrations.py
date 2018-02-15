"""initial migrations

Revision ID: bbb34ab1bddf
Revises: 
Create Date: 2018-01-21 22:28:51.040216

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bbb34ab1bddf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE projects (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            name VARCHAR(1024) NOT NULL
        );

        CREATE TABLE project_keys (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            key VARCHAR(2048) NOT NULL,
            project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
            UNIQUE (project_id, key)
        );

        CREATE TABLE locales (
            PRIMARY KEY (code),
            code VARCHAR(5) NOT NULL,
            lang VARCHAR(512) NOT NULL,
            country VARCHAR(512) NOT NULL
        );

        CREATE TABLE project_translations (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            translation TEXT,
            locale_code VARCHAR(5) NOT NULL REFERENCES locales (code),
            project_id UUID NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
            key_id UUID NOT NULL REFERENCES project_keys (id) ON DELETE CASCADE,
            UNIQUE (project_id, key_id, locale_code)
        );

        CREATE TABLE users (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            name VARCHAR(2048) NOT NULL,
            email VARCHAR(2048) NOT NULL,
            hashed_password VARCHAR(4096) NOT NULL,
            UNIQUE (email)
        );

        CREATE TABLE roles (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            role_code VARCHAR(255) NOT NULL,
            UNIQUE (role_code)
        );

        CREATE TABLE project_users (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users (id) ON DELETE CASCADE,
            project_id UUID REFERENCES projects (id) ON DELETE CASCADE,
            role_id UUID REFERENCES roles (id) ON DELETE CASCADE,
            UNIQUE (project_id, user_id)
        );

        CREATE TABLE project_clients (
            PRIMARY KEY (id),
            id UUID DEFAULT uuid_generate_v4(),
            client_name VARCHAR(2048) NOT NULL,
            client_secret VARCHAR(4096) NOT NULL,
            project_id UUID REFERENCES projects (id) ON DELETE CASCADE
        );
    """)


def downgrade():
    op.execute("""
        DROP TABLE projects;
        DROP TABLE project_keys;
        DROP TABLE locales;
        DROP TABLE project_translations;
        DROP TABLE users;
        DROP TABLE roles;
        DROP TABLE project_users;
        DROP TABLE project_clients;
    """)
