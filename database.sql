-- Database: signin/wl

-- DROP DATABASE IF EXISTS "signin/wl";

CREATE DATABASE "signin/wl"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
	
	CREATE TABLE [IF NOT EXISTS] <signin> (
   <username> <data_type(length)> [column_contraint],
   <pass> <data_type(length)> [column_contraint],
...
   <columnN> <data_type(length)> [column_contraint],
   [table_constraints]
);

	CREATE TABLE [IF NOT EXISTS] <win/loss> (
   <win> <data_type(length)> [column_contraint],
   <loss> <data_type(length)> [column_contraint],
...
   <columnN> <data_type(length)> [column_contraint],
   [table_constraints]
);