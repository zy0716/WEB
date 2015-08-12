/**
 * Created by Administrator on 2015/8/6.
 */
function newItem(options){

    if(!options.title){
        options.title = '新增条目';
    }
    if(!options.icon){
        options.icon = 'icon-add';
    }

    $('#ly').layout('remove','east');
    $('#ly').layout('add',{
        region:'east',
        title:options.title,
        iconCls:options.icon,
        width:690,
        split:true,
        border:false,
        collapsed:true
    });
    $('#ly').layout('expand','east');
    $('#ly').layout('panel','east').panel({
        href:options.formUrl,
        onLoad: function(){
            if(options.callbackFun){
                options.callbackFun();
            }
        }
    });
}

function editItem(e,options){

    stopPropagation(e);//阻止冒泡

    if(!options.title){
        title = '编辑条目';
    }
    if(!options.icon){
        icon = 'icon-edit';
    }

    $.get(options.dataUrl,function(result){
        if (result.msg == "success"){

            $('#ly').layout('remove','east');
            $('#ly').layout('add',{
                region:'east',
                title:options.title,
                iconCls:options.icon,
                width:690,
                split:true,
                border:false,
                collapsed:true
            });

            $('#ly').layout('expand','east');
            $('#ly').layout('panel','east').panel({
                href:options.formUrl,
                onLoad: function(){
                    //console.log('onLoad');
                    if(options.callbackFun){
                        options.callbackFun(result.data);
                    }
                }
            });
        }
    },'json');
}


//阻止事件冒泡
function stopPropagation(e){
    if (!e) e = window.event;   // Handle IE event model
    if (e.stopPropagation){
        e.stopPropagation();  // DOM model
    }else {
        e.cancelBubble = true; // IE model
    }
}


function cancelItem(){
    //$('#ly').layout('collapse','east');
    $('#ly').layout('remove','east');
}

//保存记录
function saveItem(thisform){

    thisform.form('submit',{
        url: thisform[0].action,
        onSubmit: function(){

            if(!$(this).form('validate')){
                showWarn('请检查数据是否填写完整和正确');
                return false;
            }

            $('#saveBtn').linkbutton('disable');
            return true;
        },
        success: function(result){

            result = eval('(' + result + ')');  // change the JSON string to javascript object
            if (result.msg == "success"){
                $('#dg').datagrid('reload'); // reload the sys data
                //填充表单id属性
                thisform[0].id.value = result.data.id;
                //显示提示
                showMsg(result.txt);
            }else if(result.msg == "repeat"){
                showWarn(result.txt);
            }
            $('#saveBtn').linkbutton('enable');
        }
    });
}


//显示记录解析json属性
function buildDataProp(itemName, data){
    var obj = {};
    for(prop in data[itemName]){
        obj[itemName + '.' + prop] = data[itemName][prop];
    }
    return obj;
}

//删除多条记录
function destroyItems(url){
    var rows = $('#dg').datagrid('getSelections');

    if (rows.length > 0){
        $.messager.confirm('警告','您确定要删除选中的记录吗?',function(r){
            if (r){
                var idstr = '?';
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    idstr += 'id=' + row.id + '&';
                }
                idstr = idstr.substring(0, idstr.length-1);

                $.post(url + idstr,function(result){
                    if (result.msg == "success"){
                        $('#dg').datagrid('reload'); // reload the sys data
                        showMsg(result.txt);
                    }  else if(result.msg == "error"){
                        $('#dg').datagrid('reload');
                        showError(result.txt);
                    }
                },'json');
            }
        });
    }else{
        showWarn('请选择要删除的记录！');
    }
}
//删除记录
function destroyItem(e, url){

    stopPropagation(e);//阻止冒泡

    $.messager.confirm('警告','您确定要删除这条记录?',function(r){
        if (r){
            $.get(url,function(result){
                if (result.msg == "success"){
                    $('#dg').datagrid('reload'); // reload the sys data
                    showMsg(result.txt);
                } else if(result.msg == "error"){
                    $('#dg').datagrid('reload');
                    showError(result.txt);
                }
            },'json');
        }
    });

}

function sendTo(url){
    var rows = $('#dg').datagrid('getSelections');

    if (rows.length > 0){
        $.messager.confirm('警告','您确定要操作选中的记录吗?',function(r){
            if (r){
                var idstr = '?';
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];

                    idstr += 'id=' + row.id + '&';
                }
                idstr = idstr.substring(0, idstr.length-1);

                $.post(url + idstr,function(result){
                    if (result.msg == "success"){
                        $('#dg').datagrid('reload'); // reload the sys data
                        showMsg(result.txt);
                    }  else if(result.msg == "error"){
                        showError(result.txt);
                    }
                },'json');
            }
        });
    }else{
        showWarn('请选择要操作的记录！');
    }
}

//正常操作提示
function showMsg(txt){
    $.messager.show({ // show error message
        title: '提示',
        msg: "<span class='wy-msg-ok'>" + txt + "</span>",
        timeout:5000/*,
         showType:'fade',
         style:{
         right:'',
         bottom:''
         }*/
    });
}

//警告操作提示
function showWarn(txt){
    $.messager.alert('警告',txt,'warning');
}

//错误提示
function showError(txt){
    $.messager.alert('错误',txt,'error');
}

//打开页面标签
function open1(url, title){

    var tab = $('#tt').tabs('getSelected');  // get selected panel
    $('#tt').tabs('update', {
        tab: tab,
        options: {
            title: title,
            url: url  // the new content URL
        }
    });

    $(tab).panel('refresh',url);
    /*$('#home_panel').panel('setTitle',title);*/
}

//导航
$(function(){

    $('.wy-nav li').hover(
        function () {
            $(this).addClass("hover");
        },
        function () {
            $(this).removeClass("hover");
        }
    );
});


//管制类别和限制销售数量控制
function funControlledCategory(){
    if($('#controlledDrug1').prop("checked")){
        $('#controlledCategory').parent().parent().hide();
        $('#controlledCategory').combogrid('disableValidation');//禁用验证


        $('#countLimit').parent().parent().hide();
        $('#countLimit').numberbox('disableValidation');//禁用验证


    }else{
        $('#controlledCategory').parent().parent().show();
        $('#controlledCategory').combogrid('enableValidation');//启用验证

        $('#countLimit').parent().parent().show();
        $('#countLimit').numberbox('enableValidation');//启用用验证

    }
}

//是否拆零和拆零数量控制
function funOpenStock(){

    if($('#openStock1').prop("checked")){

        $('#splitSpecifications').parent().parent().hide();
        $('#splitSpecifications').validatebox('disableValidation');//禁用验证
    }else{

        $('#splitSpecifications').parent().parent().show();
        $('#splitSpecifications').validatebox('enableValidation');//启用用验证
    }
}

//显示药品基本信息
function showDrugTable(data){

    $('#genericName').text(data.genericName);
    $('#productName').text(data.productName);
    $('#dosageForm').text(data.dosageForm);
    $('#specification').text(data.specification);
    $('#manufacturer').text(data.manufacturer);
    $('#vendor').text(data.vendor);
    $('#approvalNumber').text(data.approvalNumber);
    $('#drugRang').text(data.drugRang);
    $('#storageCondition').text(data.storageCondition);
    $('#drugCategory').text(data.drugCategory);

    $('#openStock').text(data.openStockString);

    if(data.openStock == '是'){
        $('.splitSpecifications').text(data.splitSpecifications);
    }else{
        $('.splitSpecifications').text('');
    }

    $('#controlledDrug').text(data.controlledDrugString);

    $('#chineseMedicineArea').text(data.chineseMedicineArea);


}

//清空药品基本信息
function clearDrugTable(){

    $('#genericName').text('');
    $('#productName').text('');
    $('#dosageForm').text('');
    $('#specification').text('');
    $('#manufacturer').text('');
    $('#vendor').text('');
    $('#approvalNumber').text('');
    $('#drugRang').text('');
    $('#storageCondition').text('');
    $('#drugCategory').text('');

    $('#openStock').text('');
    $('#controlledDrug').text('');

    $('#chineseMedicineArea').text('');

    $('.splitSpecifications').text('');//文本域后的单位名称

}


//显示药品采购本信息
function showPurchaseTable(data){
    $('#price').text(data.price);
    $('#count').text(data.countSplitSpecificationsString);
    $('#totalPrice').text(data.totalPrice);
    $('#purchaseDate').text(data.purchaseDate);
    $('#buyer').text(data.buyer);
}
//显示订单验收本信息
function showCheckTable(data){
    $('#lotnumber').text(data.lotnumber);
    $('#pruduceDate').text(data.pruduceDate);
    $('#periodOfValidity').text(data.periodOfValidity);
    $('#numberOfArrival').text(data.numberOfArrival);
    $('#numberOfQualified').text(data.numberOfQualified);
    $('#checkStatus').text(data.checkStatus);
    $('#result').text(data.result);
    $('#checkDate').text(data.checkDate);
    $('#inspector').text(data.inspector);
}

//在验收记录中显示采购信息和药品信息
function showCheckacceptNowForm(data){
    //药品
    $('#genericName').text(data.purchaseOrder.genericName);
    $('#productName').text(data.purchaseOrder.productName);
    $('#dosageForm').text(data.purchaseOrder.dosageForm);
    $('#specification').text(data.purchaseOrder.specification);
    $('#manufacturer').text(data.purchaseOrder.manufacturer);
    $('#vendor').text(data.purchaseOrder.vendor);
    $('#approvalNumber').text(data.purchaseOrder.approvalNumber);
    $('#drugRang').text(data.purchaseOrder.drugRang);
    $('#storageCondition').text(data.purchaseOrder.storageCondition);
    $('#drugCategory').text(data.purchaseOrder.drugCategory);


    $('#openStock').text(data.purchaseOrder.openStockString);
    if(data.purchaseOrder.openStock == '是'){
        $('#splitSpecifications').text(data.purchaseOrder.splitSpecifications);
    }else{
        $('#splitSpecifications').text('');
    }

    $('#controlledDrug').text(data.purchaseOrder.controlledDrugString);

    $('#chineseMedicineArea').text(data.purchaseOrder.chineseMedicineArea);


    //采购
    $('#price').text(data.purchaseOrder.price);
    $('#count').text(data.purchaseOrder.countSplitSpecificationsString);
    $('#totalPrice').text(data.purchaseOrder.totalPrice);
    $('#purchaseDate').text(data.purchaseOrder.purchaseDate);
    $('#buyer').text(data.purchaseOrder.buyer);
}

//显示库存基本信息
function showStorageTable(data){
    $('#lotnumber').text(data.lotnumber);
    $('#count').text(data.countSplitSpecificationsString);
    $('#countLock').text(data.countLockSplitSpecificationsString);
    $('#price').text(data.price.toFixed(2));
    $('#pruduceDate').text(data.pruduceDate);
    $('#periodOfValidity').text(data.periodOfValidity);

    $('#retailPrice').text(data.retailPriceString);

}

//清空存基本信息
function clearStorageTable(){
    $('#lotnumber').text('');
    $('#count').text('');
    $('#price').text('');
    $('#pruduceDate').text('');
    $('#periodOfValidity').text('');

    $('#retailPrice').text('');
    $('#countLock').text('');
}

function printForm(){

    var mode = "popup";
    var options = { mode : mode, popX: 0, popY: 0};
    $("div#myPrintArea").printArea(options);
}




/**验收列表 药品记录列显示***********************************************************/
function ca_checkStatusFormater(value,row,index){
    if(value === '合格'){
        return '<span style="color:green;">合格</span>';
    }else if(value === '不合格'){
        return '<span style="color:red;">不合格</span>';
    }else if(value === '需要审核'){
        return '<span style="color:orange;">需要审核</span>';
    }else if(value === null){
        return '<span style="color:gray;">(请填写详细信息)</span>'
    }
}

function ca_checkLockedFormater(value,row,index){
    if(value === true){
        return '<span title="已锁定" class="lockColumn" ></span>';
    }else if(value === false){
        return '<span style="color:green;">已解锁</span>';
    }else{
        return '<span>未锁定</span>';
    }
}

function ca_priceStringFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.priceString;
    }else{
        return value;
    }

}
function ca_countFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.countSplitSpecificationsString;
    }else{
        return value;
    }
}
function ca_totalPriceStringFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.totalPriceString;
    }else{
        return value;
    }
}
function ca_purchaseDateFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.purchaseDate;
    }else{
        return value;
    }
}
function ca_buyerFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.buyer;
    }else{
        return value;
    }
}

function ca_genericNameFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.genericName;
    }else{
        return value;
    }
}
function ca_productNameFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.genericName;
    }else{
        return value;
    }
}
function ca_dosageFormFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.dosageForm;
    }else{
        return value;
    }
}
function ca_specificationFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.specification;
    }else{
        return value;
    }
}
function ca_manufacturerFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.manufacturer;
    }else{
        return value;
    }
}
function ca_vendorFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.vendor;
    }else{
        return value;
    }
}
function ca_approvalNumberFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.approvalNumber;
    }else{
        return value;
    }
}
function ca_drugRangFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.drugRang;
    }else{
        return value;
    }
}
function ca_storageConditionFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.storageCondition;
    }else{
        return value;
    }
}
function ca_drugCategoryFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.drugCategory;
    }else{
        return value;
    }
}
function ca_openStockformater(value,row,index){

    if(row.purchaseOrder){
        return row.purchaseOrder.openStockString;
    }else{
        return value;
    }
}
function ca_controlledDrugformater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.controlledDrugString;
    }else{
        return value;
    }
}
function ca_chineseMedicineAreaFormater(value,row,index){
    if(row.purchaseOrder){
        return row.purchaseOrder.chineseMedicineArea;
    }else{
        return value;
    }
}