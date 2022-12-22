const express = require('express');
const app = express();
const port = 3000;

const request = require('request');

const fs = require('fs');
const path = require('path');
const csvFilePath = path.join(__dirname, 'stationInfo.csv');
const csvFile = fs.readFileSync(csvFilePath, 'utf-8');
let stationData = {}

const line = {
    1001:"1호선",
    1002:"2호선",
    1003:"3호선",
    1004:"4호선",
    1005:"5호선",
    1006:"6호선",
    1007:"7호선",
    1008:"8호선",
    1009:"9호선",
    1063:"경의중앙",
    1065:"공항",
    1067:"경춘",
    1075:"수인분당",
    1077:"신분당",
    1092:"우이신설",
}

app.listen(port, () => {
    console.log(`${port}포트 서버 실행`);

    for (let station of csvFile.split('\r\n')) {
        let splitedData = station.split(',');
        stationData[splitedData[1]] = splitedData[2]; //이 데이터 좀 바꿔야함
    }
});

app.get("/metro", (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Content-Type', 'application/json; charset=UTF-8');
    let requestUrl = "http://swopenAPI.seoul.go.kr/api/subway/4a4c59534966736838357a47736d6d/json/realtimeStationArrival/0/12/" + encodeURIComponent(req.query.search); //요청을 역명(한국어로함)
    request.get({ uri: requestUrl }, (error, response, body) => {   

        if (JSON.parse(body).code == undefined || JSON.parse(body).code == "INFO-000") {
            res.send(JSON.stringify(primaryProcessing(JSON.parse(body))));
        } else {
            res.status(400).send();
        }
        

        //} else {
        //    res.send("무언가 잘못된것이 있다");
        //}                
    });
});



function primaryProcessing(responseObj) { //라인넘버 필요없고 라인이 몇개인지 필요  헤더에 호선몇개걸쳐있는지알려주면되지않을까
                                            // 라인추가될때 body { line : {왼쪽오른쪽}, list4개 : {}}
    let outheader = {length: 0};
    let outbody = {};

    responseObj.realtimeArrivalList.forEach((e) => {
        if (outbody[line[e.subwayId]] == undefined) {
            outheader.length++;
                
            outbody[line[e.subwayId]] = {
                before: stationData[e.statnTid],
                next: stationData[e.statnFid],
                leftCount: 0,
                left: {},
                rightCount: 0,
                right: {}
            }
        }
        if (e.subwayHeading == "오른쪽" && outbody[line[e.subwayId]].rightCount < 2) {
            outbody[line[e.subwayId]].right[`right${outbody[line[e.subwayId]].rightCount}`] = {
                arivTime: e.barvlDt,
                arivMsg: e.arvlMsg2,
                arivStaion: e.arvlMsg3,
                trainState: e.arvlCd,
                trainGoal: e.trainLineNm,
            }
            outbody[line[e.subwayId]].rightCount++;
        } else if(e.subwayHeading == "왼쪽" && outbody[line[e.subwayId]].leftCount < 2) {
            outbody[line[e.subwayId]].left[`left${outbody[line[e.subwayId]].leftCount}`] = {
                arivTime: e.barvlDt,
                arivMsg: e.arvlMsg2,
                arivStaion: e.arvlMsg3,
                trainState: e.arvlCd,
                trainGoal: e.trainLineNm,
            }
            outbody[line[e.subwayId]].leftCount++;
        }
    });
    return {header: outheader, body: outbody}
}

// subwayId: '1001', 
// barvlDt: '0', 시간
// arvlMsg2: '[16]번째 전역 (금정)', 추가정보 -> 떨어진 거리같은거
// arvlMsg3: '금정',
// arvlCd: '99' 출발? 이런 상태
// trainLineNm: '청량리행 - 시청방면',
// statnFid: '1001000134', 전?
// statnTid: '1001000132', 후?

// subwayHeading: '오른쪽', 왼쪽오른쪽