"use strict";
// var defaultCurrencies = {
//     BTC:{
//         complex:708659466230,
//         hashingPower:1,
//         hashingPowerUnit:1000000000,
//         powerConsumption:1000,
//         powerCost:.4,
//     },
//     LTC:{
//         complex:275721
//     },ETH:{
//         complex:1.215*1000000000000000
//     },ETC:{
//         complex:1215000000000000
//     },XMR:{
//         complex:14.08*1000000000
//     },ZEC:{
//         complex:365064
//     },
//     //PASC:{complex:365064},
//     DASH:{
//         complex: 365064
//     }
// };

var defaultCurrencies = {};
for(var i in window.vsbCryptoCalculatorInitData.currencies)defaultCurrencies[window.vsbCryptoCalculatorInitData.currencies[i].name]= window.vsbCryptoCalculatorInitData.currencies[i];
console.debug('defaultCurrencies',defaultCurrencies,window.vsbCryptoCalculatorInitData);
function dw_calc(i){
    var hp = parseFloat($('#hashing-power').val()),
        hpu = parseInt($("[name=currentHashingUnit]").val()),
        pc = parseFloat($('#power-consumption').val())/1000,
        cs = parseFloat($('#cost').val()),
        c =  cc.currencies[i];
    var nethash=c.coinsnapshotfullbyid.General.NetHashesPerSecond*((c.coinsnapshotfullbyid.General.NetHashesPerSecond>1000000000000)?1:1000000000),
        userratio=(hp*hpu)/nethash,
        blockperhour=3600/c.coinsnapshotfullbyid.General.BlockTime,
        coinhour=c.coinsnapshotfullbyid.General.BlockReward*userratio*blockperhour;
        console.debug("userratio= "+(hp*hpu)+" / "+nethash+" = "+userratio);
        console.debug("blockperhour= 3600 / "+c.coinsnapshotfullbyid.General.BlockTime+" = "+blockperhour);
        console.debug("coinhour="+coinhour);
        /*
        Это если по полочкам разложить..
        Пример, для ETH
        reward=5
        nethash=5561,06256687778*1e9
        difficulty=86967*1e9
        userhash (МХ/с)=100
        ------------------

        blocktime=(86967*1e9)/(5561,06256687778*1e9)=15,63855809
        userratio=(100*1e6)/(5561,06256687778*1e9)=0,0000180
        blockperhour=3600/15,63855809=230,20025
        coinhour=5*0,0000180*230,20025=0,0207180

        Т.е. 0,0207180 монеты в час
    */
    return {

        day:{
            coins:coinhour*24,
            debit:pc*cs*24,
            reward:c.price.Price*coinhour*24,
            profit:c.price.Price*coinhour*24-pc*cs*24
        },
        week:{
            coins:coinhour*24*7,
            debit:pc*cs*24*7,
            reward:c.price.Price*coinhour*24*7,
			profit:c.price.Price*coinhour*24*7-pc*cs*24*7
        },
        month:{
            coins:coinhour*24*7*30,
            debit:pc*cs*24*7*30,
            reward:c.price.Price*coinhour*24*7*30,
			profit:c.price.Price*coinhour*24*7*30-pc*cs*24*7*30
        },
        year:{
            coins:coinhour*24*365,
            debit:pc*cs*24*365,
            reward:c.price.Price*coinhour*24*365,
			profit:c.price.Price*coinhour*24*365-pc*cs*24*365
        },
        profit: 100*(c.price.Price*coinhour)/(pc*cs) -100
    };
}
function dw_calc2(i){
    var hp = parseFloat($('#hashing-power').val()),
        hpu = parseInt($("[name=currentHashingUnit]").val()),
        pc = parseFloat($('#power-consumption').val())/1000,
        cs = parseFloat($('#cost').val()),
        c =  cc.currencies[i];
    var blocktime=c.complex/(c.coinsnapshot.NetHashesPerSecond),
        userratio=(hp*hpu)/(c.coinsnapshot.NetHashesPerSecond),
        blockperhour=3600/blocktime,
        coinhour=c.coinsnapshot.BlockReward*userratio*blockperhour;
    console.debug("NetHashesPerSecond="+c.coinsnapshot.NetHashesPerSecond);
    console.debug("BlockReward="+c.coinsnapshot.BlockReward);
    console.debug("blocktime="+blocktime);
    console.debug("userratio="+userratio);
    console.debug("blockperhour="+blockperhour);
    console.debug("hp="+hp);
    console.debug("hpu="+hpu);
    console.debug("pc="+pc);
    console.debug("cs="+cs);
        /*
        Это если по полочкам разложить..
        Пример, для ETH
        reward=5
        nethash=5561,06256687778*1e9
        difficulty=86967*1e9
        userhash (МХ/с)=100
        ------------------

        blocktime=(86967*1e9)/(5561,06256687778*1e9)=15,63855809
        userratio=(100*1e6)/(5561,06256687778*1e9)=0,0000180
        blockperhour=3600/15,63855809=230,20025
        coinhour=5*0,0000180*230,20025=0,0207180

        Т.е. 0,0207180 монеты в час
    */
    return {

        day:{
            coins:coinhour*24,
            debit:pc*cs*24,
            reward:c.price.Price*coinhour*24,
            profit:c.price.Price*coinhour*24-pc*cs*24
        },
        week:{
            coins:coinhour*24*7,
            debit:pc*cs*24*7,
            reward:c.price.Price*coinhour*24*7,
			profit:c.price.Price*coinhour*24*7-pc*cs*24*7
        },
        month:{
            coins:coinhour*24*7*30,
            debit:pc*cs*24*7*30,
            reward:c.price.Price*coinhour*24*7*30,
			profit:c.price.Price*coinhour*24*7*30-pc*cs*24*7*30
        },
        year:{
            coins:coinhour*24*365,
            debit:pc*cs*24*365,
            reward:c.price.Price*coinhour*24*365,
			profit:c.price.Price*coinhour*24*365-pc*cs*24*365
        },
        profit: 100*(c.price.Price*coinhour)/(pc*cs) -100
    };
};
var page ={
    tabId:"#dw_tabs",
    bodyId:"#dw_body",
    sourceUrl:"https://www.cryptocompare.com",
    current:"BTC",
    draw:{
        tabs:function(c){
            if(c=="undefined" || typeof(c)=="undefined")return;
            var s='';
            for(var i in c)
                s+='<li role="presentation" data-name="'+c[i].Name+'"><a class="ng-binding" href="javascript:void(0);" onclick="page.draw.body(\''+c[i].Name+'\');">'+c[i].Name+'</a></li>'
            $(page.tabId).html(s);
        },
        body:function(i,change=true){
            var c = cc.currencies[i];
            if(change){
                $('#hashing-power').val(c.hashingPower);
                $("[name=currentHashingUnit]").val(c.hashingPowerUnit);
                $('#power-consumption').val(c.powerConsumption);
                $('#cost').val(c.powerCost);
            }
            var calc = dw_calc(i),
                profitDayPercent = ((100*calc.day.reward/calc.day.debit)-100),
                capitalizeFirstLetter = function (string) {return string.charAt(0).toUpperCase() + string.slice(1);};
            $(".calculator-results").removeClass("results-positive").removeClass("results-negative").addClass((profitDayPercent>0)?"results-positive":"results-negative");
            page.current = i;
            console.debug(c,calc);
            $(page.tabId+' li').removeClass('active');
            $(page.tabId+' li[data-name="'+c.Name+'"]').addClass('active');
            $(page.bodyId+' .panel-calculator .panel-image').html('<a href="javascript:void(0);"><img title="Logo BTC" src="'+page.sourceUrl+c.ImageUrl+'?width=200"></a>');
            $(page.bodyId+' .panel-calculator .calculated-for-value').text('1 '+c.Name+' = $'+c.price.Price);
            $(' .results-header .circle-values').html(
                '<div class="circle-value circle-first" title="This is the total mined - the total cost">'
                +'<div class="circle-label">Profit per month</div>'
                +'    <div class="circle-content ng-binding">$ '
                +calc.month.profit.toFixed(2)+'</div>'
                +'</div><div class="circle-value"><div class="circle-label">Profit ratio per day</div><div class="circle-content ng-binding">'
                +profitDayPercent.toFixed(2)+' %</div></div>'
            );

            $('.calculator-results .calculator-container').remove();
            for(var ii in calc){
                if(["day","week","month","year"].indexOf(ii)<0)continue;
                var $cc = $('<div class="calculator-container"></div>').appendTo('.calculator-results')
                $cc.append('<div class="calculator-row-name">'+capitalizeFirstLetter(ii)+'</div>');
                $cc.append('<div class="calculator-col calculator-first-col"><div class="calculator-label" title="This is the total mined - the total cost">Profit per '+ii+'</div><div class="calculator-value ng-binding">'
                            +'$ '+calc[ii].profit.toFixed(4)+'</div></div>');
                $cc.append('<div class="calculator-col"><div class="calculator-label">Mined/'+ii+'</div><div class="calculator-value ng-binding">'
                            +' '+calc[ii].coins.toFixed(8)+'</div></div>');
                $cc.append('<div class="calculator-col"><div class="calculator-label">Power cost/'+capitalizeFirstLetter(ii)+'</div><div class="calculator-value ng-binding">'
                            +'$ '+calc[ii].debit.toFixed(2)+'</div></div>');
            }

        }
    }
};

var cc = {
    imgUrl:"https://www.cryptocompare.com/",
    apiUrl:"https://www.cryptocompare.com/api/data/",
    newApiUrl:"https://api.cryptocompare.com/data/",
    events:{
        ready:"cc:ready"
    },
    // apiUrl: "https://min-api.cryptocompare.com/data/",
    currencies:defaultCurrencies,
    coinlist: function(){
        var tut = this;
        this._call({
            method:'coinlist',
            callback: function(d,s,x){
                //console.debug("coinlist callback",d,s,x);
                var f = true;
                for(var i in d.Data){
                    if(typeof(tut.currencies[i])=="undefined")continue;
                    tut.currencies[i] = $.extend(tut.currencies[i],d.Data[i]);
                    tut.price(i);
                    // tut.coinsnapshot(i);
                    tut.coinsnapshotfullbyid(i);
                    f=false;
                }
            }
        });
    },
    price: function(currency){
        var tut = this;//,cb=(arguments.length>1)?arguments[1]:null;
        this._call({
            method:'price',
            data:{
                fsym:currency.toUpperCase(),
                tsyms:'USD'
            },
            callback: function(d,s,x){
                tut.currencies[currency]["price"]=d.Data[0];
            }
        });
    },
    coinsnapshot: function(currency){
        var tut = this,cb=(arguments.length>1)?arguments[1]:null,a=(arguments.length>2)?arguments[2]:false;
        this._call({
            method:'coinsnapshot',
            data:{
                fsym:currency.toUpperCase(),
                tsym:'USD'
            },
            callback: function(d,s,x){
                tut.currencies[currency]["coinsnapshot"]=d.Data;
                tut.currencies[currency]["ready"]=true;
                var ready = true;
                for(var i in tut.currencies)ready&=tut.currencies[i].ready;
                if(ready)$("body").trigger(tut.events.ready);
                // if(cb!=null && typeof(cb)=="function")cb(tut.currencies[currency],a);
            }
        });
    },
    coinsnapshotfullbyid: function(currency){
        var tut = this,cb=(arguments.length>1)?arguments[1]:null,a=(arguments.length>2)?arguments[2]:false,coin=this.currencies[currency];
        this._call({
            method:'coinsnapshotfullbyid',
            data:{
                id:coin.Id,
            },
            callback: function(d,s,x){
                tut.currencies[currency]["coinsnapshotfullbyid"]=d.Data;
                tut.currencies[currency]["ready"]=true;
                var ready = true;
                for(var i in tut.currencies)ready&=tut.currencies[i].ready;
                if(ready)$("body").trigger(tut.events.ready);
                // if(cb!=null && typeof(cb)=="function")cb(tut.currencies[currency],a);
            }
        });
    },
    _call: function(a){
        $.getJSON(this.apiUrl+a.method,(typeof(a.data)!="undefined")?a.data:{},(typeof(a.callback)!="undefined")?a.callback:function(d,s,x){
            console.debug(this,"default callback",d,s,x);
        });
    }
};
$(document).ready(function(){
    cc.coinlist();
});
$("body").on(cc.events.ready,function(){
    console.debug(cc.events.ready+" ready");
    page.draw.tabs(cc.currencies);
    page.draw.body('BTC');
    $(".panel-calculator input,.panel-calculator select").on("change keyup",function(){
        page.draw.body(page.current,false);
    });
})
