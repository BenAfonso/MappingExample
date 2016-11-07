CREATE DATABASE mobytick;
\c mobytick;
CREATE EXTENSION postgis;
SELECT postgis_full_version(); -- Should return a version number
-- if it doesn't, check that you have installed PostGis on your machine

CREATE TABLE siege (
    id SERIAL NOT NULL
);

SELECT AddGeometryColumn ('siege','geom',4326,'POLYGON',2);

CREATE TABLE zone (
    id SERIAL NOT NULL
);

SELECT AddGeometryColumn ('zone','geom',4326,'POLYGON',2);