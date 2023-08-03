use("products");
db.electronics.find()
//44  fiyatı 200 dem düşük olan tum doc price degerini 50 arttıralım.
use("products");
db.electronics.updateMany(
    {"price":{$lt:200}},
    {$inc:{"price":50}}
)

//45 bir doc silmek istersek 
//name i en ucuz olan ilk doc silelim 
use("products");
db.electronics.deleteOne(
    {"name":"en ucuz"},
)
//46 birden fazla doc silmek istersek 
//"name":"Woww" olan tüm doc siliniz. 
use("products");
db.electronics.deleteMany(
    {"name":"Woww"}
)
    
//47 tum doc silelim
//1.yol
use("products");
db.electronics.deleteMany({}); /**
içerisindekilerin tamamını siler  */

//2. yol
use("products");    
db.electronics.remove({});//deprecated

//3.yol 
use("products");  
db.electronics.delete();//2 ay önce delete deprecate bir mothod du artık kaldırılmı (kullanılmıyor)

//48 yeni bir doc ekleyelim
use ("products");
db.electronics.insertOne(
    {"name":"laptop",
    "brand":{"name":"Lenovo","model":"ThinkPadX1"},
    "city":["Ankara","Bursa"],
    "active":true}
);
//modeli ThinkPadX1 olan doc bulalım 
use ("products");
db.electronics.find(
    {"brand.model":"ThinkPadX1"}
)
//city getirme
//dizi içindekilerin 1 tanesini yazarsak hepsini getirir
use ("products");
db.electronics.find(
    {"city":Bursa}
)

//AGGREGATION
//yaparken groupby ile kullanıcaz .
//grupladıgımız değerlerin toplamı,ortalaması,max,min gibi değerleri bulabilmemize yarar.
//aggregation yaparken en çok duyacagımız kelime pipeline. 
//var pipeline


//*=================================================
// *                AGGREGATION
//*=================================================
// ?1) Aggregation, dokumanlardaki verilerin islenmesi ve hesaplanan
//?   sonuclarin donmesini saglayan islemlerdir.
//?
//? 2) Aggregation islemleri, farklı dokumanlardaki degerleri gruplandirabilir.))==?
//?
// ?3) Bu gruplanan veriler uzerinde cesitli islemlerin gereceklestirelerek tek
// ?   bir sonuc degerinin donmesi saglanabilir.
//?
// ?4) MongoDB, 3 farklı yontem ile aggregation gerceklestirmeye izin verir.
// ?    A) aggregation pipeline (toplama boru hattı) --> best practice...
// ?    B) map-reduce function (map indirgeme)
// ?    C) single-purpose aggregation (tek-amaç toplama)
//?
// ?5) Aggregiation, SQL'deki Join islemlerine benzetilebilir.
//*=================================================
// *            AGGREGATION PIPELINE
//*=================================================
//* SYNTAX
//*
//?   pipeline = [
//?  { $match : { … }},
//?   { $group : { … }},
//?   { $sort : { … }},
//?      ...
// ?  ]
// ?  db.collectionName.aggregate({pipeline}, {options})
//?
// ! $match() –> Verileri secerken filtrelemek icin
// ! $group({_id : "$field"}) - >islenen verilerin gruplanmasi icin
// ! $sort() -> Sonuclarin siralanmasi icin


use('okul');
db.grades.insertMany([
{"_id":6305, "name": "A. MacDyver", "assignment":5, "points" :24},
{"_id":6308, "name": "B. Batlock", "assignment":3, "points" :22},
{"_id":6312, "name": "M. Tagnum", "assignment":5, "points" :30},
{"_id":6319, "name": "R. Stiles", "assignment":2, "points" :12},
{"_id":6322, "name": "A. MacDyver", "assignment":2, "points" :14},
{"_id":6334, "name": "R. Stiles", "assignment":1, "points" :10},
{"_id":6345, "name": "A. Stiles", "assignment":1, "points" :10}
]);

//1-> her bir assignment icin toplam puanları listeleyelim.
use('okul');
var pipeline=[
//taskin asamaları : filtreleme yok gruplama var. 

//!düz assignment yazarsak sadece kelimeyi alır 
//! başına $ koyarsak değerini alır
{$group : {"_id":"$assignment","total_points":{$sum :"$points"}}} 
];
db.grades.aggregate(pipeline);

//2-> her bir assignment ın ort puanını hesaplayın artan olrak sıralayın
use('okul');
var pipeline=[
//taskin aşamaları filtreleme yok, gruplama var
{$group:{"_id":"$assignment","avg_points":{$avg:"$points"}}},
{$sort:{avg_points:1}}
];
db.grades.aggregate(pipeline);

//3-> her bir assignment in min degerini alıp azalan sekilde sıralayınız .
use('okul');
var pipeline=[
    {$group:{_id:"$assignment",min_points:{$min:"$points"}}},
    {$sort:{min_points:-1}}
]
db.grades.aggregate(pipeline);

//*birden fazla şart oldugunda 
/*
*var pipeline=[
*{$match:{"price":{$lt:400}}},
*{$sort:{"price":-1}},
*{$skip:1},
*{$limit:1},
*{$set:{"name":"en ucuz"}}//güncelleme //set en sona yazılıyor
*];
db.grades.aggregate(pipeline);

*/

//4->assignment degeri 4 den kücük olan her bir assignment in max puanlarını hesaplayalım zalan şekilde list
use('okul');
var pipeline=[
    {$match:{"assignment":{$lt:4}}},    //!assignment da  4 den küçük olan  degerleri alır
    {$group:{"_id":"$assignment",max_point:{$max:"$points"}}},  //!bunların max degerini alır 
    {$sort:{"max_point":-1}}  //!degerleri büyükten-kücüge sıralar
];
db.grades.aggregate(pipeline);

//5->ismi A ile baslayan doc toplam puanlarını hesaplayıp listeleyelim.
use('okul');
var pipeline=[
    {$match:{"name":{$regex:"^A"}}},//!a ile başlayanlar icin $regex"^A"
    {$group:{"_id":"", "total_points":{$sum:"$points"}}}  //!gruplama yok ise "" veya null kullanılı
]
db.grades.aggregate(pipeline);

//6-> ismi s ile biten doc toplam puanlarını hesaplayıp listeleyelim.
use('okul');
var pipeline=[
    {$match:{"name":{$regex:"s$"}}},// !s ile bitenler icin $regex"s$"
    {$group:{"_id":"", "total_points":{$sum:"$points"}}}  // !gruplama yok ise "" veya null kullanılı
];
db.grades.aggregate(pipeline);

use('okul');
db.grades.find()

//7-> point degeri 19 dan düşük olan doc sayisini bulalım 

//1.yol 
use('okul');
db.grades.find(
    {"points":{$lt:19}}
    ).count();

//2.yol
use('okul');
db.grades.count({"points":{$lt:19}});

//3.yol
use('okul');
var pipeline=[
    {$match:{"points":{$lt:19}}},
    {$count:"düşük puanlar"}
];
db.grades.aggregate(pipeline);