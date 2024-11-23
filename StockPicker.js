var xhr1 = new XMLHttpRequest();
var xhr2 = new XMLHttpRequest();
var parser = new DOMParser();
var form=document.forms['stock-picker'];
var historicalPrice;
var historicalDividend;
var chart;

form.onsubmit = function() {
    //Extract the values from the form.
    var Symbol = form.symbol.value.toUpperCase();
    var Category = form.category.value;
    if(Category=='stock-screener') {
        var Screener = form.stock_screener.value;
        var Value = form.stock_screener_value.value;
        var searchURL="https://fmpcloud.io/api/v3/stock-screener?"+Screener+"="+Value+"&apikey=b54dcc9193d68212218be2e4a3696db8";
    } else if(Category=='daily-dividend') {
        searchURL="https://fmpcloud.io/api/v3/historical-price-full/stock_dividend/"+Symbol+"?apikey=b54dcc9193d68212218be2e4a3696db8";
    } else if(Symbol != undefined) {
        var searchURL="https://fmpcloud.io/api/v3/"+Category+"/"+Symbol+"?apikey=b54dcc9193d68212218be2e4a3696db8";
    }
    console.log(searchURL);
    //prepare the request
    xhr1.open("GET", searchURL);
    //send the request
    xhr1.send();
    return false;//Do not leave this webpage
}

//Handle the response from the Fmp Cloud server
xhr1.onload = async function() {

    var xmlDoc = JSON.parse(this.responseText);
//  console.log(xmlDoc[0]);
/*  console.log(xmlDoc.symbol);
    console.log(xmlDoc.historical[0]);
    console.log(xmlDoc.historical[1]);
    console.log(xmlDoc.historical[2]);*/
    var data = document.querySelector("#data");
    while(data.hasChildNodes()) {
        data.removeChild(data.childNodes[0]);
    }
    data.innerHTML="";

    var len=1;
    var exchange="exchange-all";
    if(form.category.value=="stock-screener") {
        len=xmlDoc.length;
        exchange = form.stock_screener_exchange.value;
    } else if(form.category.value=="daily-dividend") {
        len=xmlDoc.historical.length;
        var searchURL="https://fmpcloud.io/api/v3/historical-price-full/"+xmlDoc["symbol"]+"?serietype=line&apikey=b54dcc9193d68212218be2e4a3696db8";
        console.log(searchURL);
        //prepare the request
        xhr2.open("GET", searchURL);
        //send the request
        xhr2.send();

        //Delay for one second
        let promise = new Promise((res, rej) => {
            setTimeout(() => res("Now it's done!"), 1000)
        });
        // wait until the promise returns us a value
        let result = await promise; 
        var ctx = document.getElementById('myChart').getContext('2d');
        chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: 'My First dataset',
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: []
                }]
            },

            // Configuration options go here
            options: {}
        });
    }
    for(var i=0; i<len; ++i){
        var pElem=document.createElement('p');
        var name=[];
        var value=[];
        var num=0;
        if(form.category.value=="daily-dividend") {
            var yieldPercent = GetDividendYield(xmlDoc.historical[i]["adjDividend"], xmlDoc.historical[i]["date"]);
            pElem.innerHTML+="<b>"+xmlDoc.historical[i]["date"]+"</b>: <mark>"+xmlDoc.historical[i]["adjDividend"]+"</mark> <mark>("+yieldPercent+"&#37)</mark><br>";
            pElem.innerHTML+="<hr><br>";
            data.appendChild(pElem);
            chart.data.labels.push(xmlDoc.historical[len-i-1]["date"]);
            chart.data.datasets.forEach((dataset)=> {
                dataset.data.push(GetDividendYield(xmlDoc.historical[len-i-1]["adjDividend"], xmlDoc.historical[len-i-1]["date"]));
            });
        } else if(form.category.value=="stock-screener") {
            var symbol=xmlDoc[i]["symbol"];
            console.log("Symbol:"+symbol);
            if(exchange=="exchange-all" || (exchange=="exchange-tsx" && symbol.endsWith(".TO"))) {
                for(x in xmlDoc[i]) {
                    name[num] = x;
                    value[num] = xmlDoc[i][name[num]];
                    if(name[num]=="symbol") {
                        pElem.innerHTML+="<b>"+name[num]+"</b>: <u style=\"color:blue;cursor:pointer;\" onclick=\"DetailSearch(\'"+value[num]+"\')\">"+value[num]+"</u><br>";
                        console.log(pElem.innerHTML);
                    } else {
                        pElem.innerHTML+="<b>"+name[num]+"</b>: <mark>"+value[num]+"</mark><br>";
                    }
                    if(num%5==4) pElem.innerHTML+="<br>";
                    console.log(name[num]+" "+value[num]);
                    ++num;
                }
                pElem.innerHTML+="<hr><br>";
                data.appendChild(pElem);
            }
        } else {
            for(x in xmlDoc[i]) {
                name[num] = x;
                value[num] = xmlDoc[i][name[num]];
                pElem.innerHTML+="<b>"+name[num]+"</b>: <mark>"+value[num]+"</mark><br>";
                if(num%5==4) pElem.innerHTML+="<br>";
                console.log(name[num]+" "+value[num]);
                ++num;
            }
            pElem.innerHTML+="<hr><br>";
            data.appendChild(pElem);
        }
    }
}

xhr2.onload = function() {
    historicalPrice = JSON.parse(this.responseText);
    console.log("HISTORICALPRICE:");
    console.log(historicalPrice);
}

var dividendIndex=0;
function GetDividend(priceDate) {
    var index=historicalDividend.historical.findIndex(checkDate, priceDate);
    if(index!=-1) {
        dividendIndex = index;
    }
    return historicalDividend.historical[dividendIndex]["adjDividend"];
}

function GetDividendYield(yieldPerShare, yieldDate) {
    var index=historicalPrice.historical.findIndex(checkDate, yieldDate);
    var yieldPercent = 4*100*yieldPerShare/historicalPrice.historical[index]["close"];
    return yieldPercent.toFixed(5);
}

function checkDate(date) {
    return date["date"]==this;
}

function SetVisibility() {
    var Category = form.category.value;
    var elems=form.querySelectorAll('.screener');
    var len = elems.length;
    if(Category=="stock-screener") {
        for(var i=0; i<len; ++i) {
            elems[i].classList.remove('hidden');
        }
        form.symbol.disabled=true;
    } else {
        for(var i=0; i<len; ++i) {
            if(!elems[i].classList.contains('hidden')) {
                elems[i].classList.add('hidden');
            }
        }
        if(chart!=undefined){
            chart.destroy();
        }
        form.symbol.disabled=false;
    }
}

function DetailSearch(symbol) {
    console.log("DetailSearch("+symbol+"):");
    var data = document.querySelector("#data");
    while(data.hasChildNodes()) {
        data.removeChild(data.childNodes[0]);
    }
    data.innerHTML="";
    var elems=form.querySelectorAll('.screener');
    var len = elems.length;
    for(var i=0; i<len; ++i) {
        if(!elems[i].classList.contains('hidden')) {
            elems[i].classList.add('hidden');
        }
    }
    form.symbol.disabled=false;
    form.symbol.value=symbol;
    form.category.value="daily-dividend";
}