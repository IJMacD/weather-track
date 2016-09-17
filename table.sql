-- Table: public.weather_updates

-- DROP TABLE public.weather_updates;

CREATE TABLE public.weather_updates
(
  id serial NOT NULL,
  station_name text,
  "time" bigint,
  air_temperature numeric,
  relative_humidity integer,
  min_air_temperature numeric,
  max_air_temperature numeric,
  grass_temperature numeric,
  min_grass_temperature numeric,
  wind_direction text,
  wind_speed integer,
  wind_gust integer,
  sea_level_pressure numeric,
  visibility integer,
  global_solar numeric,
  direct_solar numeric,
  diffuse_solar numeric,
  CONSTRAINT weather_update_pkey PRIMARY KEY (id),
  CONSTRAINT station_time UNIQUE (station_name, "time")
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.weather_updates
  OWNER TO wcvdelqxqjvelo;
