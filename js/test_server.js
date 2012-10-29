/**
 * Created with JetBrains WebStorm.
 * User: hosup
 * Date: 12. 9. 13
 * Time: 오후 3:50
 * To change this template use File | Settings | File Templates.
 */
var http = require('http');
var fs   = require('fs');
var url  = require('url');
var path ="/mnt/sdcard/DCIM/.thumbnails";
var thumb_nails_for_block = null;
var scheme = "file://";
var access_allow_role = {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE",
    "Cache-Control" : "no-cache"
};
var file_name_array = null;
var scroll_index = null;
var MAX_IMAGE_NUM = 48 + 24;
var request_count = 1 ;

//모든 썸내일을 이름.jpg를 file_name_array_for_block에 담아 놓는다.
function fetch_all_filename(path){

    file_name_array = [];
    console.log('-----------------get_file_name-----------------------');
    console.log('path : ' + path);
    fs.readdirSync(path).forEach(function(filename ){

        var image = {};
        image["url"] =  scheme+ path +"/"+filename;
    //    console.log(" filename : " + filename );
        file_name_array.push(image);
    });

}

//file_name_array_for_block에 에 있는 썸네일 이름을 index에 맞게 넘겨준다.
function get_filename_from(index){
    console.log('----------------- get from index -----------------------');
    var file_name_array_for_block = [];
    var i   = index;
    var max = index + MAX_IMAGE_NUM;
    if(file_name_array != null){
        console.log('----------------- ge from array  -----------------------');
        for( ; i < max ; i++){
           // console.log("get_filename_from index  : " + i );
            file_name_array_for_block.push(file_name_array[i]);

        }

    }
    return file_name_array_for_block;
}
function getFileState(file){
    fs.stat(file, function(error, stats){
        if(error){
            console.log("file state error : " +err.message);
        }
    });
}

http.createServer(function (req, res) {

    //chrome에서 요청이 올때 cross domain을 해결 하기위해 prelight 요청에 대해서도 access allow해준다.
    if(req.method == "OPTIONS"){
        console.log('-----------------optiosn request-----------------------');
        response.writeHead(200,access_allow_role);
        response.end();
        console.log('-----------------optiosn end-----------------------');
    }

    console.log('---------------- request count ---------------');

    console.log('request count  ' + request_count);

    console.log('---------------- request count end ---------------');

    //index 파싱을 위해 query 파싱을 한다.
    console.log('----------------- query ----------------');
    parsed_url = url.parse(req.url, true);
    console.log("index  : "  +  parsed_url.query.index);
    scroll_index =  parseInt(parsed_url.query.index);
    console.log('----------------- query end----------------');



    res.writeHead(200, access_allow_role);



    console.time("getfile time");
    console.log('-----------------test start-----------------------');

    if(file_name_array == null){
        console.log('-----------------first fetch-----------------------');
        fetch_all_filename(path);
        console.log("---------- all thumbnail num ------------");
        console.log("all thumbnail num : " + file_name_array.length);
        console.log("---------- all thumbnail num end ------------");
    }

    if(scroll_index > file_name_array.length){
        console.log("-------------index query number error ------------");
    }else{
        thumb_nails_for_block = get_filename_from(scroll_index);
        console.log('thumb_nails total : ' + thumb_nails_for_block.length);

        res.end(JSON.stringify(thumb_nails_for_block));
        console.timeEnd("getfile time");
        console.log('-----------------test end-----------------------');
    }

    request_count = request_count + 1;
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');