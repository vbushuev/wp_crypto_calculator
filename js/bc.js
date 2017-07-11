var currentPriceBigCalc = "RUB";
var currentCoinBigCalc = "BTC";
var maximumRowDraw = 0;
var voidRowDraw = 0;

$(document).ready(function()
{
	date = new Date();
	month = date.getMonth();
	month = month + 1;
	if (month.toString.length == 1)
		month = "0" + month;
	$('#monthStart option[value='+month+']').attr('selected','selected');
	year = date.getFullYear();
	$('#yearStart option:[value='+year+']').attr('selected','selected');

	changePriceOrDiff(true,true);
	setTimeout(function(){otherBigCalc()},1000);
});

function changePriceOrDiff(price,diff)
{
	if (diff == true)
		$.ajax
		({
			type: "POST",
			url: "/stats/bitcoinDiffTable.php",
			data: {coin:currentCoinBigCalc},
			dataType: 'json',
			success: function(data) // Выполнится во время успешного запроса ajax
			{
				setValueForm("monthDiffChahgeDiff", roundMy(data['0'].pastD,0));
				setValueForm("diff", data['0'].diff);
			}
		});

    if (price == true)
		$.ajax
		({
			type: "POST",
			url: "/stats/tradeCoins.php",
			data: {coin:currentCoinBigCalc},
			dataType: 'json',
			success: function(data) // Выполнится во время успешного запроса ajax
			{
				switch (currentPriceBigCalc)
				{
					case "USD": {setValueForm("curs",data.btce.USD.last); break;};
					case "RUB": {setValueForm("curs",data.btce.RUR.last); break;};
					case "EUR": {setValueForm("curs",data.btce.EUR.last); break;};
					default : {setValueForm("curs",data.btce.USD.last); break;};
				}
			}
		});
    setTimeout(function(){redrawTableCalculate()},1000);
}

function setValueForm(name,value)
{
    $('input[name='+name+']').val(value);
}

function roundMy(value,znak)
{
    value = value * Math.pow(10,znak);
    value = Math.round(value);
    value = value / Math.pow(10,znak);
    return value;
}

function otherBigCalc()
{
    var toSend = {};

    toSend['type'] = 'otherBigCalc';
    toSend['voidMonth'] = voidRowDraw;
    toSend['maximumMonth'] = maximumRowDraw;
    toSend['coin'] = currentCoinBigCalc;
    toSend['calcPrice'] = currentPriceBigCalc;
    toSend['diff'] = getValueForm('diff');
    toSend['hash'] = getValueForm('hash');
    toSend['curs'] = getValueForm('curs');
    toSend['price'] = getValueForm('price');
    toSend['fee'] = getValueForm('fee');
    toSend['rig_cost'] = getValueForm('rig_cost');
    toSend['rig_w'] = getValueForm('rig_w');
    toSend['price_el'] = getValueForm('price_el');
    toSend['amort_inp'] = getValueForm('amort_inp');
    toSend['amort_sw'] = $("#amort_sw").prop("checked");

    znak = $('#monthPriceChange option:selected').val();
    if(znak == "plus")
    {
        toSend['monthPriceChahgeDiff'] = getValueForm('monthPriceChahgeDiff');
    }
    else
    {
        toSend['monthPriceChahgeDiff'] = -1 * getValueForm('monthPriceChahgeDiff');
    }

    $.ajax
	({
		type: "POST",
		url: "/stats/calculate.php",
		data: { send : JSON.stringify(toSend) },
		dataType: 'json',
		success: function(data) // Выполнится во время успешного запроса ajax
		{
			$("#profitHourBTC").html(data.BTCinHour);
			$("#profitHourCurr").html(data.curInHour);
			$("#profitDayBTC").html(data.BTCinDay);
			$("#profitDayCurr").html(data.curInDay);

			$("#miningPriceHour0").html(data.miningPriceInHour);
			$("#profitCleanHour0").html(data.miningProfitInHour);

			$("#avg_50prc").html(data.avg50prc);
			$("#avg_65prc").html(data.avg65prc);
			$("#avg_80prc").html(data.avg80prc);
			$("#avg_95prc").html(data.avg95prc);
			$("#avg_50").html(data.avg50);

			$("#miningPriceHour1").html(data.miningPriceInHour);
			$("#profitCleanHour1").html(data.miningProfitInHour);

			$("#price_1_btc_hard").html(data.cost1BTCwHard);
			$("#price_1_btc").html(data.cost1BTC);
		}
	});
}







function changeCoinCalc()
{
    currentCoinBigCalc = $('#coinCurr option:selected').val();
    newCoin = currentCoinBigCalc;
    if (newCoin == "BTC")
    {
        for(i = 0; i <= 6; i++)
            $("#BTCLTC"+i).html("BTC");
        $("#BTCLTCHash0").html("MHash/s");
        $('input[name=price]').val(12.5);
    }
if (newCoin == "LTC")
    {
        for(i = 0; i <= 6; i++)
            $("#BTCLTC"+i).html("LTC");
        $("#BTCLTCHash0").html("KHash/s");
        $('input[name=price]').val(50);
    }
    changePriceOrDiff(true,true);
    setTimeout(function(){otherBigCalc()},1000);
    changeCoinStat(newCoin);
}

function changePriceCalc()
{
    oldCoin = currentPriceBigCalc;

    currentPriceBigCalc = $('#currPrice option:selected').val();

    newCoin = currentPriceBigCalc;

    var toSend = {};
    toSend['from'] = oldCoin;
    toSend['to'] = newCoin;
    toSend['type'] = 'reCoin';


    $.ajax
        ({
            type: "POST",
            url: "/stats/calculate.php",
            dataType: 'json',
            data:{send : JSON.stringify(toSend)},
            success: function(data) // Выполнится во время успешного запроса ajax
                    {
                        priceRate = parseFloat(data.rate);
                        oldPriceEl = parseFloat(getValueForm('price_el'));
                        oldRgCost = parseFloat(getValueForm('rig_cost'));
                        newPriceEl = roundMy(oldPriceEl*priceRate,2);
                        newRgCost = roundMy(oldRgCost*priceRate,2);

                        setValueForm('price_el',newPriceEl);
                        setValueForm('rig_cost',newRgCost);
                    }
        });


    for(i = 0; i <= 7; i++)
        $("#CURR"+i).html(newCoin);

    changePriceOrDiff(true,false);
    setTimeout(function(){otherBigCalc()},1000);
}



function redrawTableCalculate()
{
    startMonth = parseInt($('#monthStart option:selected').val());
    startYear = parseInt($('#yearStart option:selected').val());
    voidMonth = calcMonthToDraw(startYear,startMonth);
    monthDraw=voidMonth + parseInt(getValueForm("tot_days"));

    voidRowDraw = voidMonth;
    maximumRowDraw = monthDraw;

    date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth();
    currentMonth = currentMonth + 1;

    changeDiff = $('#monthDiffChange option:selected').val();

    $("#priceTableAll").html("");
    for (i = 0; i < monthDraw; i++ )
    {
        if (currentMonth.length == 1)
           currentMonth = "0" + currentMonth;
        else
           currentMonth.toString();

        $("#priceTableAll").append(drawString(currentMonth,currentYear,i));
        $('#changeDiff'+i+' option[value='+changeDiff+']').attr('selected','selected');

        if(i==0)
        {
            $('#difficult'+i).html(getValueForm('diff'));
        }
        else
        {
            drawCurrentMonthDiff(i);
        }


        currentMonth = parseInt(currentMonth);
        if (currentMonth == 12)
        {
            currentMonth = 1;
            currentYear ++;
        }
        else
        {
            currentMonth ++;
        }
    }

    recalcTable(0);


}


function drawString(monthDraw,yearDraw,number)
{
    nameMonth = getNameMonthFromNumber(monthDraw);
    yearDraw = yearDraw.toString();
    diffChangeValue = getValueForm('monthDiffChahgeDiff');
    stringToWrite = "<tr>\n\
    <td class='td_left'>"+yearDraw+" "+nameMonth+"</td> \n\
    <td class='td_left'><span id='difficult"+number+"'>0</span></td>\n\
    <td class='td_left'>\n\
    <table style='border-collapse:collapse;'>\n\
        <tbody>\n\
            <tr>\n\
                <td>\n\
                    <select name='changeDiff"+number+"' id='changeDiff"+number+"' style='BORDER: 1px solid #9c9c9c;' onchange=\"recalcDifficultInTable('"+number+"')\">\n\
                        <option value='plus'> +&nbsp;&nbsp;</option>\n\
                        <option value='minus'> - &nbsp;&nbsp;</option>\n\
                    </select>\n\
                </td>\n\
            <td>\n\
                <input class='curs'\n\
                    style='BORDER: #c0c0c0 1px solid; width: 30px; height:15px; margin: 3px; FONT-SIZE: 12px; color: #000000;' \n\
                    id='diffChangeDiff"+number+"' \n\
                    name='diffChangeDiff"+number+"' \n\
                    value='"+diffChangeValue+"' \n\
                    type='text'\n\
                    onkeyup=\"checkNumberTable('diffChangeDiff"+number+"','"+number+"')\">\n\
            </td>\n\
                <td style='padding:0 0 0 5px;'>%</td></tr></tbody></table>\n\
            </td>\n\
            <td class='td_left' id='profitBTC'><span id='profitBTC"+number+"'>0</span></td>\n\
            <td class='td_left' id='profitCurrent'><span id='profitCurrent"+number+"'>0</span></td>\n\
            <td class='td_left' ><span id='ROI"+number+"'>0</span> %</td>\n\
        </tr>";
    return stringToWrite;
}


function drawCurrentMonthDiff(month)
{
    month = parseInt(month);

    znak = $('#changeDiff'+(month-1)+' option:selected').val();

    if(znak == "plus")
    {
        percent = parseFloat(getValueForm('diffChangeDiff'+(month -1)));
    }
    else
    {
        percent = -1 * parseFloat(getValueForm('diffChangeDiff'+(month -1)));
    }

    difficultOld = parseFloat($("#difficult"+(month-1)).html());

    difficultNew = roundMy(difficultOld + (percent/100) * difficultOld,2);

    $("#difficult"+month).html(difficultNew);
}


function recalcDifficultInTable(number)
{
    number = parseInt(number);
    for (i = number+1; i < maximumRowDraw; i++)
    {
        drawCurrentMonthDiff(i);
    }
    recalcTable(0);
}



function recalcTable(fromWhere)
{
    var toSend = {};

    toSend['type'] = 'tableBigCalc';
    toSend['voidMonth'] = voidRowDraw;
    toSend['maximumMonth'] = maximumRowDraw;
    toSend['fromWhere'] = fromWhere;
    toSend['coin'] = currentCoinBigCalc;
    toSend['calcPrice'] = currentPriceBigCalc;
    toSend['diff'] = getValueForm('diff');
    toSend['hash'] = getValueForm('hash');
    toSend['curs'] = getValueForm('curs');
    toSend['price'] = getValueForm('price');
    toSend['fee'] = getValueForm('fee');
    toSend['rig_cost'] = getValueForm('rig_cost');
    toSend['rig_w'] = getValueForm('rig_w');
    toSend['price_el'] = getValueForm('price_el');
    toSend['amort_inp'] = getValueForm('amort_inp');
    toSend['amort_sw'] = $("#amort_sw").prop("checked");

    znak = $('#monthPriceChange option:selected').val();
    if(znak == "plus")
    {
        toSend['monthPriceChahgeDiff'] = getValueForm('monthPriceChahgeDiff');
    }
    else
    {
        toSend['monthPriceChahgeDiff'] = -1 * getValueForm('monthPriceChahgeDiff');
    }

    for (i = fromWhere; i < maximumRowDraw; i++)
    {

        toSend['val'+i] = {};

        var a = {};

        a['difficult'] = $("#difficult"+i).html();
        a['profitBTC'] = $("#profitBTC"+i).html();
        a['profitCurrent'] = $("#profitCurrent"+i).html();
        a['ROI'] = $("#ROI"+i).html();
        toSend['val'+i] = a;
    }


    $.ajax
        ({
            type: "POST",
            url: "/stats/calculate.php",
            data: { send : JSON.stringify(toSend) },
            dataType: 'json',
            success: function(data) // Выполнится во время успешного запроса ajax
                    {

                        for(i = fromWhere; i< maximumRowDraw; i++ )
                        {
                            $("#profitBTC"+i).html(data['val'+i].profitBTC);
                            $("#profitCurrent"+i).html(data['val'+i].profitCurrent);
                            $("#ROI"+i).html(data['val'+i].ROI);
                        }
                        $("#profitBTCFull").html(data.profitBTCFull);
                        $("#profitCurrentFull").html(data.profitCurrentFull);
                        $("#ROIFull").html(data.ROIFull);
                    }
        });


}

function otherBigCalc()
{
    var toSend = {};

    toSend['type'] = 'otherBigCalc';
    toSend['voidMonth'] = voidRowDraw;
    toSend['maximumMonth'] = maximumRowDraw;
    toSend['coin'] = currentCoinBigCalc;
    toSend['calcPrice'] = currentPriceBigCalc;
    toSend['diff'] = getValueForm('diff');
    toSend['hash'] = getValueForm('hash');
    toSend['curs'] = getValueForm('curs');
    toSend['price'] = getValueForm('price');
    toSend['fee'] = getValueForm('fee');
    toSend['rig_cost'] = getValueForm('rig_cost');
    toSend['rig_w'] = getValueForm('rig_w');
    toSend['price_el'] = getValueForm('price_el');
    toSend['amort_inp'] = getValueForm('amort_inp');
    toSend['amort_sw'] = $("#amort_sw").prop("checked");

    znak = $('#monthPriceChange option:selected').val();
    if(znak == "plus")
    {
        toSend['monthPriceChahgeDiff'] = getValueForm('monthPriceChahgeDiff');
    }
    else
    {
        toSend['monthPriceChahgeDiff'] = -1 * getValueForm('monthPriceChahgeDiff');
    }

    $.ajax
        ({
            type: "POST",
            url: "/stats/calculate.php",
            data: { send : JSON.stringify(toSend) },
            dataType: 'json',
            success: function(data) // Выполнится во время успешного запроса ajax
                    {
                        $("#profitHourBTC").html(data.BTCinHour);
                        $("#profitHourCurr").html(data.curInHour);
                        $("#profitDayBTC").html(data.BTCinDay);
                        $("#profitDayCurr").html(data.curInDay);

                        $("#miningPriceHour0").html(data.miningPriceInHour);
                        $("#profitCleanHour0").html(data.miningProfitInHour);

                        $("#avg_50prc").html(data.avg50prc);
                        $("#avg_65prc").html(data.avg65prc);
                        $("#avg_80prc").html(data.avg80prc);
                        $("#avg_95prc").html(data.avg95prc);
                        $("#avg_50").html(data.avg50);

                        $("#miningPriceHour1").html(data.miningPriceInHour);
                        $("#profitCleanHour1").html(data.miningProfitInHour);

                        $("#price_1_btc_hard").html(data.cost1BTCwHard);
                        $("#price_1_btc").html(data.cost1BTC);
                    }
        });
}




function getValueForm(name)
{
    return $('input[name='+name+']').val();
}

function getNameMonthFromNumber(number)
{
    number = number - 1;
    switch(number)
    {
       case 0 : {return "Январь";};
       case 1 : {return "Февраль";};
       case 2 : {return "Март";};
       case 3 : {return "Апрель";};
       case 4 : {return "Май";};
       case 5 : {return "Июнь";};
       case 6 : {return "Июль";};
       case 7 : {return "Август";};
       case 8 : {return "Сентябрь";};
       case 9 : {return "Октябрь";};
       case 10 : {return "Ноябрь";};
       case 11 : {return "Декабрь";};
    };

}




function checkNumber(nameField)
{
    fieldNumber = getValueForm(nameField);
    if (fieldNumber == "")
        fieldNumber = 0;

    fieldNumber = fieldNumber.replace(/[^\d\.]/g, '');

    if (fieldNumber < 0)
        fieldNumber = - fieldNumber;

    if (nameField == "tot_days")
    {
        if (fieldNumber >= 60)
            fieldNumber = 60;
        fieldNumber = roundMy(fieldNumber,0);
    }

    setValueForm(nameField,fieldNumber);
    setTimeout(function(){redrawTableCalculate()},500);
    setTimeout(function(){otherBigCalc()},1000);
}

function checkNumberTable(nameField,number)
{
    fieldNumber = getValueForm(nameField);
    if (fieldNumber == "")
        fieldNumber = 0;
    fieldNumber = parseFloat(fieldNumber);
    if (fieldNumber < 0)
        fieldNumber = - fieldNumber;
    setValueForm(nameField,fieldNumber);

    recalcDifficultInTable(number);


}

function checkMonthAndYear()
{
    choseMonth = $('#monthStart option:selected').val();
    choseYear = $('#yearStart option:selected').val();
    choseDate = parseInt(choseYear + choseMonth);

    date = new Date();
    currentYear = date.getFullYear();
    currentYear = currentYear.toString();
    currentMonth = date.getMonth();
    currentMonth = currentMonth + 1;
    if (currentMonth.length == 1)
        month = "0" + month;
    else
        currentMonth.toString();
    currentDate = parseInt(currentYear + currentMonth);

    if(currentDate > choseDate)
    {
        $('#monthStart option[value='+currentMonth+']').attr('selected','selected');
        $('#yearStart option:[value='+currentYear+']').attr('selected','selected');
    }
    setTimeout(function(){redrawTableCalculate()},500);

    setTimeout(function(){otherBigCalc()},1000);
}

function calcMonthToDraw(yearStart,monthStart)
{
    date = new Date();
    currentYear = date.getFullYear();
    currentMonth = date.getMonth();
    currentMonth = currentMonth + 1;
    voidMonth = monthStart + 12 * (yearStart - currentYear) - currentMonth;
    return voidMonth;
}
