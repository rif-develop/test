var localhost = "http://127.0.0.1"; //dws 서버 주소
var port = "16716"; // dws port
var port_for_file_scheme="1337";
//pc에서 테스트하기 위해 chrome pc브라우져로 접속하면 포트 번호 바꾼다
if($.browser.chrome) {

    port_for_file_scheme = 1336;
}


var get_info = "/api/pCloud/device/info"; // dws get info 주소
var mp3_list = "/api/pCloud/device/media/music/songs?maxItems=80"; // mp3 list get 주소
var images_list = "/api/pCloud/device/media/photo/images?view=RECENT&maxItems=300";
var api_test = "/?index=";
//var url = host + images_list; // url 만들기
var index = 0; //index 세팅

var host = localhost+":"+ port_for_file_scheme;
var url = host + api_test+index; // url 만들기



var term = null;
var diff = null;
var time = null;
var before_scroll_time_stamp =  null;
var scroll_interval = null;
var MAX_IMAGE_NUM = 24;

var scroll_count = 0 ;

$.console_out = function(msg){
    console.log("---------------console log----------------");
    console.log(msg);
    console.log("---------------console log end----------------");
}

$(document).ready(function(){
    var window_width = $(window).width();
    var window_height = $(window).height();
    var document_width =$(document).width();

    $('#content').scroll(function(data){

        scroll_count = scroll_count +1;
        var now_scroll_time_stamp = data.timeStamp;
        if(before_scroll_time_stamp == null){
            before_scroll_time_stamp = now_scroll_time_stamp;
        }else{
          scroll_interval = now_scroll_time_stamp -  before_scroll_time_stamp;
          $.console_out(scroll_interval);
          before_scroll_time_stamp =  now_scroll_time_stamp;
        }
        //if(scroll_interval > 0 ){
          //  $.console_out("index : " +index);
            get_images(index);

        //}


    });
//    $.console_out( "window width : " + window_width );
//    $.console_out( "document width : " + document_width);
   // alert(window_height + ": "+ window_width);

    $("#content").addClass("no_padding no_margin content_view");
    $("#horizon_panel").addClass("no_padding no_margin vertical_view");
    get_images();
});


function get_images(){
    var args = Array.prototype.slice.call(arguments);
    if(args[0]){
        url = host + api_test + args[0];
    }
    $.getJSON(url, function(data){
        index += data.length;
        var images_divs = [];
        var content_part_divs = [];
        var content_part_div_index = null;




        // allshare play interface 용
        // $.each(data.images, function(i, image_object){
        $.each(data, function(i, image_object){
           // console.log(" thumbnail url : " + host+"/"+image_object.thumbnailUri);
            images_divs.push(document.createElement("image"));
            images_divs[i].id=i;
//            images_divs[i].src=host + "/"+ image_object.thumbnailUri;
            images_divs[i].src = image_object.url;
            //$.console_out(image_object.url);
            //$(images_divs[i]).css({"width" : "90px", "height" : "90px", "border": "black 1px","float":"left" ,"-webkit-border-image" : "-webkit-gradient(linear, left top, left bottom, from(#00abeb), to(#fff), color-stop(0.5, #fff), color-stop(0.5, #66cc00)) 21 30 30 21 repeat repeat"});
            $(images_divs[i]).addClass("image_list");

            if (i%24 == 0){
                //0, 24, 48, 72,
                //부분 div를 만든다
                content_part_divs.push(document.createElement("div"));
                //현재 까지 부분 의 인댁스를 구한다.

                content_part_div_index = $(content_part_divs).length-1;
                content_part_divs[content_part_div_index].id = "part_"+content_part_div_index;
                //$.console_out("content_part_div_index : " + content_part_div_index);
                //현재 부분에 클래스를 입힌다.
                var $content_part_divs =$(content_part_divs[content_part_div_index]);
                $content_part_divs.addClass("content_part_view no_padding no_margin");
                //현재 부분에 이미지를 넣는다.
                $content_part_divs.append(images_divs[i]);
            } else{
                //$.console_out("content_part_else : " + content_part_div_index + " i : " + i);
                //현재 컨턴트 파트를 알아 온 뒤
                var $content_part_divs = $(content_part_divs[content_part_div_index]);
                $content_part_divs.append(images_divs[i]);
            }


        });

        $.each(content_part_divs, function(i,item){
            //$.console_out("hosup : " + content_part_div_index);
            $("#horizon_panel").append(item);

        });

        $.console_out(images_divs.length);
    });
}

