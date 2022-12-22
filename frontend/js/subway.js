const formArea = document.querySelector("#forms");
const search = document.querySelector('#search');
let searchSation = "";

document.querySelector('#searchBtn').addEventListener('click', requestPlz);

search.addEventListener("keydown", (event) => {
    if (search.value != "" && event.key == 'Enter') {
        requestPlz();
    }
});

function requestPlz() {
    if (search.value == "") {
        return alert("역이름을 입력해주세요.");
    }
    searchSation = search.value.replace("역","");

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                formArea.innerHTML = "";
                for (let key in JSON.parse(xhr.responseText).body) {
                    makeForm(JSON.parse(xhr.responseText).body[key],key);
                }
            } else {
                if (xhr.status == 400) {
                    alert("잘못된 역명을 입력하였습니다. \n" +
                        "ex) 서울역, 강남역");
                } else {
                    alert("요청 서버 확인을 부탁 드립니다.");
                }
            }
        }
    }
    xhr.open("GET", "http://127.0.0.1:3000/metro?search=" + encodeURIComponent(searchSation));
    xhr.send();
}

function makeForm(obj, lineName) {  

    const form = document.createElement("div"); //line
    form.classList.add("line");

        const backfront = document.createElement("div"); // backfront
        backfront.classList.add("backfront");
            const back = document.createElement("div"); // id =back
            back.id = "back"
            back.innerHTML = "< 하행";
            const line_name = document.createElement("div");
                const line_name_en = document.createElement("span"); // line_name_en
                line_name_en.classList.add("line_name_en");
                line_name_en.innerHTML = lineName;
                line_name.appendChild(line_name_en);
                

            const front = document.createElement("div"); //id =front
            front.id = "front";
            front.innerHTML = "상행 >"

            backfront.appendChild(back);
            backfront.appendChild(line_name);
            backfront.appendChild(front);

        const space = document.createElement("div"); // space
        space.classList.add("space");
            const left_name = document.createElement("div"); // left_name
            left_name.classList.add("left_name");

            if (obj.before != undefined) {
                left_name.innerHTML = obj.before;
            } else {
                left_name.innerHTML = "종점";
            }            
            const center_name = document.createElement("div"); //center_name
            center_name.classList.add("center_name");
                const line_name_kr = document.createElement("span"); //line_name_kr
                line_name_kr.classList.add("line_name_kr");
                line_name_kr.innerHTML = searchSation;
                center_name.appendChild(line_name_kr);
            const right_name = document.createElement("div"); //right_name
            right_name.classList.add("right_name");

            if (obj.next != undefined) {
                right_name.innerHTML = obj.next;
            } else {
                right_name.innerHTML = "종점";
            }      

            space.appendChild(left_name);
            space.appendChild(center_name);
            space.appendChild(right_name);
            space.style.setProperty("background-color", lineColor[line_name_en.innerHTML]);

        const left_line = document.createElement("div"); //left //left_line
        left_line.classList.add("left_line");
            const left_back1 = document.createElement("div");
                const left_li1 = document.createElement("li"); // left
                left_li1.classList.add("left");

                const left_soon = document.createElement("div"); //left_soon
                left_soon.classList.add("left_soon");
                left_soon.innerHTML = "value";

                if (obj.left["left0"] != undefined) {
                    left_li1.innerHTML = obj.left["left0"]["arivStaion"];
                    if (obj.left["left0"]["arivMsg"].includes("[")) {
                        let out = obj.left["left0"]["arivMsg"].replace("[","");
                        out = out.replace("]","");
                        let tmp = out.split("(");
                        left_soon.innerHTML = tmp[0];
                    } else {
                        left_soon.innerHTML = obj.left["left0"]["arivMsg"];
                    }                    
                } else {
                    left_li1.innerHTML = "종점";
                    left_soon.innerHTML = "정보없음";
                }

                left_back1.appendChild(left_li1);
                left_back1.appendChild(left_soon);

            const left_back2 = document.createElement("div");
                const left_li2 = document.createElement("li");
                left_li2.classList.add("left");
         
                const left_next = document.createElement("div"); //left_next
                left_next.classList.add("left_next");
                left_next.innerHTML = "value";

                if (obj.left["left1"] != undefined) {
                    left_li2.innerHTML = obj.left["left1"]["arivStaion"];
                    if (obj.left["left1"]["arivMsg"].includes("[")) {
                        let out = obj.left["left1"]["arivMsg"].replace("[","");
                        out = out.replace("]","");
                        let tmp = out.split("(");
                        left_next.innerHTML = tmp[0];
                    } else {
                        left_next.innerHTML = obj.left["left1"]["arivMsg"];
                    }     
                } else {
                    left_li2.innerHTML = "종점";
                    left_next.innerHTML = "정보없음";
                }

                left_back2.appendChild(left_li2);
                left_back2.appendChild(left_next);

            left_line.appendChild(left_back1);
            left_line.appendChild(left_back2);

        const right_line = document.createElement("div"); //right //right_line
        right_line.classList.add("right_line");
            const right_back1 = document.createElement("div");
                const right_li1 = document.createElement("li") // right
                right_li1.classList.add("right");

                const right_soon = document.createElement("div"); //right_soon
                right_soon.classList.add("right_soon");

                if (obj.right["right0"] != undefined) {
                    right_li1.innerHTML = obj.right["right0"]["arivStaion"];
                    if (obj.right["right0"]["arivMsg"].includes("[")) {
                        let out = obj.right["right0"]["arivMsg"].replace("[","");
                        out = out.replace("]","");
                        let tmp = out.split("(");
                        right_soon.innerHTML = tmp[0];
                    } else {
                        right_soon.innerHTML = obj.right["right0"]["arivMsg"];
                    }    
                } else {
                    right_li1.innerHTML = "종점";
                    right_soon.innerHTML = "정보없음";
                }

                right_back1.appendChild(right_li1);
                right_back1.appendChild(right_soon);

            const right_back2 = document.createElement("div");
                const right_li2 = document.createElement("li"); // right
                right_li2.classList.add("right");
 
                const right_next = document.createElement("div"); //right_next
                right_next.classList.add("right_next");

                if (obj.right["right1"] != undefined) {
                    right_li2.innerHTML = obj.right["right1"]["arivStaion"];
                    if (obj.right["right1"]["arivMsg"].includes("[")) {
                        let out = obj.right["right1"]["arivMsg"].replace("[","");
                        out = out.replace("]","");
                        let tmp = out.split("(");
                        right_next.innerHTML = tmp[0];
                    } else {
                        right_next.innerHTML = obj.right["right1"]["arivMsg"];
                    }    
                } else {
                    right_li2.innerHTML = "종점";
                    right_next.innerHTML = "정보없음";
                }

                right_back2.appendChild(right_li2);
                right_back2.appendChild(right_next);
            
            right_line.appendChild(right_back1);
            right_line.appendChild(right_back2);    
            
        form.appendChild(backfront);
        form.appendChild(space);
        form.appendChild(left_line);
        form.appendChild(right_line);
        formArea.appendChild(form);
}

const lineColor ={
    "1호선": "#263c98",
    "2호선": "#3cb447",
    "3호선": "#fd7401",
    "4호선": "#2e9ede",
    "5호선": "#8a34dd",
    "6호선": "#b64f0a",
    "7호선": "#6e761a",
    "8호선": "#e81e70",
    "9호선": "#d0a23a",
    "공항": "#7ab3dc",
    "경의중앙": "#8cbcaa",
    "경춘": "#19ab7c",
    "수인분당": "#ffcc37",
    "신분당": "#a71e31",
    "경강": "#3181e9",
    "서해": "#8ac53e",
    "인천1": "#6f9bd1",
    "인천2": "#feb94c",
    "에버라인": "#79c178",
    "의정부": "#efa14",
    "우이신설": "#d3ce50",
    "김포골드": "#95710a",
    "신림": "#526898",
}