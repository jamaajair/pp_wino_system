## add data to db ##

$> docker cp ./db/data/sample-data.sql wino-db:/sample-data.sql
$> docker exec -i wino-db psql -U myuser -d mydb -f /sample-data.sql