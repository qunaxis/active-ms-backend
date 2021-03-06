﻿let sql = `-- =============================================================================
-- Имя модели: DB
-- Создано: 03.10.2018 20:09:12
-- Версия модели: 
-- =============================================================================


DROP TABLE IF EXISTS "users" CASCADE;

CREATE TABLE "users" (
	"id" SERIAL NOT NULL,
	"surname" text NOT NULL,
	"name" text NOT NULL,
	"patronymic" text,
	"birthday" date,
	"phonenumber" varchar(10) NOT NULL,
	"vk_id" int4,
	"email" text,
	"photo_url_100" text,
	"photo_url_max" text,
	"access_token" text,
	"pass_id" varchar(10),
	"pass_issued_by" text,
	"pass_issued_at" date,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"updated_by_uid" int4,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "roles" CASCADE;

CREATE TABLE "roles" (
	"id" SERIAL NOT NULL,
	"title" text NOT NULL,
	"description" text,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "role_elections" CASCADE;

CREATE TABLE "role_elections" (
	"id" SERIAL NOT NULL,
	"uid" int4,
	"role_id" int4,
	"start_date" date NOT NULL,
	"end_date" date,
	"confirmed_by_uid" int4 NOT NULL,
	"confirmed" bool NOT NULL DEFAULT False,
	"created_at" timestamp NOT NULL,
	"created_by_uid" int4 NOT NULL,
	"updated_at" timestamp NOT NULL,
	"updated_by_uid" int4 NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "events" CASCADE;

CREATE TABLE "events" (
	"id" SERIAL NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"start_date" date NOT NULL,
	"start_time" time,
	"end_date" date NOT NULL,
	"end_time" time,
	"level_id" int4 NOT NULL,
	"type_id" int4,
	"points_id" int4 NOT NULL,
	"money" int4 NOT NULL,
	"created_at" timestamp NOT NULL DEFAULT NOW(),
	"created_by_uid" int4 NOT NULL,
	"updated_at" timestamp NOT NULL,
	"updated_by_uid" int4 NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "event_participants" CASCADE;

CREATE TABLE "event_participants" (
	"id" SERIAL NOT NULL,
	"uid" int4 NOT NULL,
	"event_id" int4 NOT NULL,
	"role_id" int4 NOT NULL,
	"confirmed" bool NOT NULL DEFAULT False,
	"confirmed_by_uid" int4,
	"create_at" timestamp NOT NULL DEFAULT NOW(),
	"created_by_uid" int4 NOT NULL,
	"updated_at" timestamp NOT NULL,
	"update_by_uid" int4 NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "event_roles" CASCADE;

CREATE TABLE "event_roles" (
	"id" SERIAL NOT NULL,
	"title" text NOT NULL,
	"description" text,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "event_levels" CASCADE;

CREATE TABLE "event_levels" (
	"id" SERIAL NOT NULL,
	"title" text NOT NULL,
	"description" text,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "event_types" CASCADE;

CREATE TABLE "event_types" (
	"id" SERIAL NOT NULL,
	"title" text NOT NULL,
	"description" text,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "pgas_points" CASCADE;

CREATE TABLE "pgas_points" (
	"id" SERIAL NOT NULL,
	"level_id" int4 NOT NULL,
	"role_id" int4 NOT NULL,
	"value" int4 NOT NULL,
	PRIMARY KEY("id")
);


ALTER TABLE "users" ADD CONSTRAINT "users <- users.update_by_uid" FOREIGN KEY ("updated_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "role_elections" ADD CONSTRAINT "Победить в выборах" FOREIGN KEY ("uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "role_elections" ADD CONSTRAINT "Провести выборы на роль" FOREIGN KEY ("role_id")
	REFERENCES "roles"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "role_elections" ADD CONSTRAINT "role_elections.confirmed_by_uid <- users.id" FOREIGN KEY ("confirmed_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "role_elections" ADD CONSTRAINT "role_elections.created_by_uid <- users.id" FOREIGN KEY ("created_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "role_elections" ADD CONSTRAINT "role_elections.updated_by_uid <- users.id" FOREIGN KEY ("updated_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "events" ADD CONSTRAINT "events.level_id <- event_levels.id" FOREIGN KEY ("level_id")
	REFERENCES "event_levels"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "events" ADD CONSTRAINT "event.type_id <- event_types.id" FOREIGN KEY ("type_id")
	REFERENCES "event_types"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "events" ADD CONSTRAINT "events.created_by_uid <- users.id" FOREIGN KEY ("created_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "events" ADD CONSTRAINT "events.update_by_uid <- users.id" FOREIGN KEY ("updated_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants.event_id <- events.id" FOREIGN KEY ("event_id")
	REFERENCES "events"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "event_participants" ADD CONSTRAINT "Установить роль" FOREIGN KEY ("role_id")
	REFERENCES "event_roles"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "event_participants" ADD CONSTRAINT "Указать участие пользователя в МП" FOREIGN KEY ("uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "event_participants" ADD CONSTRAINT "Подтвердить участие и роль" FOREIGN KEY ("confirmed_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants.create_by_uid <- users.id" FOREIGN KEY ("created_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants.updated_by_uid <- users.id" FOREIGN KEY ("update_by_uid")
	REFERENCES "users"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "pgas_points" ADD CONSTRAINT "pgas_points.role_id <- event_roles.id" FOREIGN KEY ("role_id")
	REFERENCES "event_roles"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;

ALTER TABLE "pgas_points" ADD CONSTRAINT "pgas_points.level_id <- event_levels.id" FOREIGN KEY ("level_id")
	REFERENCES "event_levels"("id")
	MATCH SIMPLE
	ON DELETE NO ACTION
	ON UPDATE NO ACTION
	NOT DEFERRABLE;
`

export default sql