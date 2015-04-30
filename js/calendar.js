Calendar = function(){
	//变量声明
	var wk = ['日', '一', '二', '三', '四', '五', '六'];
	var html_content = '<div class="cal_title"><a href="javascript:;" class="cal_bt_year_left">&lt;&lt;</a><a href="javascript:;" class="cal_bt_month_left">&lt;</a><a href="javascript:;" class="cal_bt_month_right">&gt;</a><a href="javascript:;" class="cal_bt_year_right">&gt;&gt;</a><span class="cal_month"></span></div><dl class="cal_date"><dt class="cal_top"></dt><dd class="cal_date_content"></dd></dl>';
	var text_top = '';
	for(x in wk){
		text_top += '<span>' + wk[x] + '</span>';
	}
	now = new Date();
	var cur_year = now.getFullYear();
	var cur_month = now.getMonth();
	trans_buf = new Array();
	//此处有预留与HTML通信
	config = {
		cal_id : '',
	};
	return {
		init: function(customConfig){
			var that = this;
			$.extend(true, config, customConfig);
			$('#' + config.cal_id).append(html_content);
			$('#' + config.cal_id).addClass("linear");
			$('#' + config.cal_id + ' .cal_top').html(text_top);
			$('#' + config.cal_id + ' .cal_bt_month_left').bind('click',function(){
				if(--cur_month<0){
					cur_month=11;
					--cur_year;
				}
				that.getDateList();
			});
			$('#' + config.cal_id + ' .cal_bt_month_right').bind('click',function(){
				if(++cur_month==12){
					cur_month=0;
					++cur_year;
				}
				that.getDateList();
			});
			//notice relative:getDateList 'not standard'
			$('#' + config.cal_id + ' .cal_bt_year_left').bind('click',function(){
				that.getDateList(--cur_year);
			});
			$('#' + config.cal_id + ' .cal_bt_year_right').bind('click',function(){
				that.getDateList(++cur_year);
			});
			this.getDateList();
		},
		//warning to add parameter relative:getDateList
		getDateList: function() {
			var strCont ='';
			var pre_month = cur_month - 1;
			var pre_year = cur_year; //here the year means the year of next month or pre month
			if(pre_month<0){
				pre_month = pre_month + 12;
				pre_year--;
			}
			var nxt_month = cur_month + 1;
			var nxt_year = cur_year;
			if(nxt_month>11){
				nxt_month = pre_month - 12;
				nxt_year++;
			}
			var pre_monthdays = new Date(pre_year, pre_month+1, 0).getDate();
			var nxt_monthdays = new Date(nxt_year, nxt_month+1, 0).getDate();
			var monthdays = new Date(cur_year,cur_month+1,0).getDate();
			var lastday = new Date(cur_year,cur_month,monthdays).getDay();
			
			for (j=-new Date(cur_year,cur_month,1).getDay();j;j++) {
				strCont += '<span class="cal_date_gone">' + (pre_monthdays+j+1) + '</span>';
			}
			while(++j<= monthdays){
				strCont += '<span>' + j + '</span>';
			}
			if(lastday!=6)
			{
				for(j=1;j<=(6-lastday);j++)
					strCont += '<span class="cal_date_coming">' + j + '</span>';
			}
			
			$('#' + config.cal_id + ' .cal_date_content').html(strCont);
			var dateelements = $('#' + config.cal_id + ' .cal_date_content span').not('.cal_date_gone');
			//title line
			$('#' + config.cal_id + ' .cal_month').html(cur_year + "年" + (cur_month+1) + "月 " );
			//sign today
			if (now.getFullYear() == cur_year && now.getMonth() == cur_month) {
				dateelements.filter(':contains(' + now.getDate() + ')').eq(0).attr("class", "cal_date_now");
			}
			//read trans_buf data & display it;sort it may be more efficient but seems unnecessary
			for(x in trans_buf){
				if(trans_buf[x].getFullYear()==cur_year&&trans_buf[x].getMonth()==cur_month){
					dateelements[trans_buf[x].getDate()-1].className+=' cal_date_choice';
				}
			}
			//delete next two lines to disable the hover
			dateelements.bind('mouseenter', function(){
				$(this).addClass('cal_date_hover');
			});
			dateelements.bind('mouseleave', function(){
				dateelements.removeClass('cal_date_hover');
			});
			dateelements.bind('click', function(){
				if($(this).attr('class').indexOf('cal_date_choice')==-1){
					$(this).addClass('cal_date_choice');
					trans_buf.push(new Date(cur_year,cur_month,parseInt($(this).text())));
				}else{
					$(this).removeClass('cal_date_choice');
					var dt=new Date(cur_year,cur_month,parseInt($(this).text()));
					for(x in trans_buf){
						if(trans_buf[x].getTime()==dt.getTime()){
							trans_buf.splice(x,1);
							break;
						}
					}
				}
			});
		}
	}
}	
