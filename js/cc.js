"use strict";
var defaultCurrencies = {
    BTC:{
        complex:708659466230,
        hashingPower:1,
        hashingPowerUnit:1073741824,
        powerConsumption:1000,
        powerCost:.4,
    },LTC:{},ETH:{},ETC:{},XMR:{},ZEC:{},PASC:{},DASH:{}
};
function dw_calc(i){
    var hp = parseFloat($('#hashing-power').val()),
        hpu = parseInt($("[name=currentHashingUnit]").val()),
        pc = parseFloat($('#power-consumption').val()),
        cs = parseFloat($('#cost').val()),
        c =  cc.currencies[i],
        blocktime=c.complex/c.coinsnapshot.NetHashesPerSecond,
        userratio=(hp*hpu)/c.coinsnapshot.NetHashesPerSecond,
        blockperhour=3600/blocktime,
        coinhour=c.coinsnapshot.BlockReward*userratio*blockperhour;
        console.debug(c.coinsnapshot.NetHashesPerSecond,c.coinsnapshot.BlockReward);
        console.debug(blocktime);
        console.debug(userratio);
        console.debug(blockperhour);
        console.debug(coinhour);
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
};
var page ={
    tabId:"#dw_tabs",
    bodyId:"#dw_body",
    sourceUrl:"https://www.cryptocompare.com",
    draw:{
        tabs:function(c){
            if(c=="undefined" || typeof(c)=="undefined")return;
            var s='';
            for(var i in c)
                s+='<li role="presentation" data-name="'+c[i].Name+'"><a class="ng-binding" href="#" onclick="page.draw.body(\''+c[i].Name+'\');">'+c[i].Name+'</a></li>'
            $(page.tabId).html(s);
        },
        body:function(i){
            var c = cc.currencies[i];
            console.debug(c);

            $('#hashing-power').val(c.hashingPower);
            $("[name=currentHashingUnit]").val(c.hashingPowerUnit);
            $('#power-consumption').val(c.powerConsumption);
            $('#cost').val(c.powerCost);
            $(page.tabId+' li').removeClass('active');
            $(page.tabId+' li[data-name="'+c.Name+'"]').addClass('active');
            $(page.bodyId+' .panel-calculator .panel-image').html('<a href="#"><img title="Logo BTC" src="'+page.sourceUrl+c.ImageUrl+'?width=200"></a>');
            $(page.bodyId+' .panel-calculator .calculated-for-value').text('1 '+c.Name+' = $'+c.price.Price);

            var calc = dw_calc(i);
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
                    tut.coinsnapshot(i);
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
})
