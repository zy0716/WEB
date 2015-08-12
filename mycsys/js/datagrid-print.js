/**
 * Created by Administrator on 2015/8/6.
 */
// printDatagrid 要打印的datagrid
function CreateDataGridPage(printDatagrid, title) {
    var styleString = '<head><title></title><link type="text/css" rel="stylesheet" href="resources/js/jquery-easyui-1.3.5/themes/default/easyui.css" ><link type="text/css" rel="stylesheet" href="resources/js/jquery-easyui-1.3.5/themes/icon.css" ><link type="text/css" rel="stylesheet" href="resources/css/web.css" ><link type="text/css" rel="stylesheet" href="resources/css/printer.css" ></head>';
    var tableString = '<body><div class="myPrintArea"><table class="print_table">';
    if(title){
        tableString += '<caption>' + title + '</caption>';
    }

    var frozenColumns = printDatagrid.datagrid("options").frozenColumns;  // 得到frozenColumns对象
    var columns = printDatagrid.datagrid("options").columns;    // 得到columns对象
    var nameList = '';

    // 载入title
    if (typeof columns != 'undefined' && columns != '') {
        $(columns).each(function (index) {
            tableString += '\n<tr><td width="30px">序号</td>';//td是序号列
            if (typeof frozenColumns != 'undefined' && typeof frozenColumns[index] != 'undefined') {
                for (var i = 0; i < frozenColumns[index].length; ++i) {
                    if (!frozenColumns[index][i].hidden) {
                        tableString += '\n<th  width="' + frozenColumns[index][i].width + '"';
                        if (typeof frozenColumns[index][i].rowspan != 'undefined' && frozenColumns[index][i].rowspan > 1) {
                            tableString += ' rowspan="' + frozenColumns[index][i].rowspan + '"';
                        }
                        if (typeof frozenColumns[index][i].colspan != 'undefined' && frozenColumns[index][i].colspan > 1) {
                            tableString += ' colspan="' + frozenColumns[index][i].colspan + '"';
                        }
                        if (typeof frozenColumns[index][i].field != 'undefined' && frozenColumns[index][i].field != '') {
                            nameList += ',{"f":"' + frozenColumns[index][i].field + '", "a":"' + frozenColumns[index][i].align + '"}';
                        }
                        tableString += '>' + frozenColumns[0][i].title + '</th>';
                    }
                }
            }
            for (var i = 0; i < columns[index].length; ++i) {
                if (!columns[index][i].hidden) {
                    tableString += '\n<th width="' + columns[index][i].width + '"';
                    if (typeof columns[index][i].rowspan != 'undefined' && columns[index][i].rowspan > 1) {
                        tableString += ' rowspan="' + columns[index][i].rowspan + '"';
                    }
                    if (typeof columns[index][i].colspan != 'undefined' && columns[index][i].colspan > 1) {
                        tableString += ' colspan="' + columns[index][i].colspan + '"';
                    }
                    if (typeof columns[index][i].field != 'undefined' && columns[index][i].field != '') {
                        nameList += ',{"f":"' + columns[index][i].field + '", "a":"' + columns[index][i].align + '"}';
                    }
                    tableString += '>' + columns[index][i].title + '</th>';
                }
            }
            tableString += '\n</tr>';
        });
    }


    // 载入内容
    var rows = printDatagrid.datagrid("getRows"); // 这段代码是获取当前页的所有行

    var nl = eval('([' + nameList.substring(1) + '])');
    for (var i = 0; i < rows.length; ++i) {

        //console.log(rows[i]);
        tableString += '\n<tr><td>'+(printDatagrid.datagrid('getRowIndex',rows[i])+1)+'</td>';//td是序号列
        $(nl).each(function (j) {
            var e = nl[j].f.lastIndexOf('_0');

            tableString += '\n<td';

            if (nl[j].a != 'undefined' && nl[j].a != '') {
                tableString += ' style="text-align:' + nl[j].a + ';"';
            }
            tableString += '>';
            if (e + 2 == nl[j].f.length) {
                tableString += rows[i][nl[j].f.substring(0, e)];
            }else{

                if(rows[i][nl[j].f]){
                    tableString += rows[i][nl[j].f];
                }
            }

            tableString += '</td>';
        });
        tableString += '\n</tr>';
    }
    // tableString += '\n</table></div></body>';

    //载入footer
    //var footerTableString = '<body><div class="myPrintArea  myfooter"><table class="wy-form-table">';
    var footerRows = printDatagrid.datagrid("getFooterRows"); //

    if(typeof footerRows != 'undefined'){
        var nl = eval('([' + nameList.substring(1) + '])');
        for (var i = 0; i < footerRows.length; ++i) {
            tableString += '\n<tr><td style="border:0;"></td>';//td是序号列
            $(nl).each(function (j) {
                var e = nl[j].f.lastIndexOf('_0');

                tableString += '\n<td';
                if (nl[j].a != 'undefined' && nl[j].a != '') {
                    tableString += ' style="text-align:' + nl[j].a + ';border:0;"';
                }else{
                    tableString += ' style="border:0;"';
                }
                tableString += '>';
                if (e + 2 == nl[j].f.length) {
                    tableString += footerRows[i][nl[j].f.substring(0, e)];
                }else{
                    if(footerRows[i][nl[j].f]){
                        tableString += footerRows[i][nl[j].f];
                    }

                }
                tableString += '</td>';
            });
            tableString += '\n</tr>';
        }
    }

    tableString += '\n</table></div></body>';

    /*var printWindow = new myPopup();
     var writeDoc = printWindow.doc;*/
    var f = new Iframe();
    writeDoc = f.doc;
    printWindow = f.contentWindow || f;

    writeDoc.open();
    writeDoc.write('<html>' + styleString + tableString + '</html>');
    writeDoc.close();

    printWindow.focus();
    printWindow.print();

}

function Iframe()
{
    var frameId = "print_div";
    var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
    var iframe;

    try
    {
        iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        $(iframe).attr({ style: iframeStyle, id: frameId, src: "" });
        iframe.doc = null;
        iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
    }
    catch( e ) { throw e + ". iframes may not be supported in this browser."; }

    if ( iframe.doc == null ) throw "Cannot find document.";

    return iframe;
}

function myPopup()
{
    var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
    //windowAttr += ",width=1200,height=500";
    windowAttr += ",resizable=yes,screenX=0,screenY=0,personalbar=no,scrollbars=yes";

    var newWin = window.open( "", "_blank",  windowAttr );

    newWin.doc = newWin.document;

    return newWin;
}
