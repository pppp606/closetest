/**
クローズテスト用 kuromojiを継承
* @class closeTest
* @method init 初期化 パラメータのセット
* @method setProblem 空白の問題文を生成
* @method check 正解率のチェック
* @property {has} data 文章データ kuromoji.jsで形態素解析済み
* @property {number} oneset oneset毎に文字を隠す
* @property {string} targetElement jqueryに渡すdomエレメント
* @property {string} DIC_URL 辞書ファイルのパス
*/
var closeTest = function(){
  this.data = {
    planText:"",
    tokenize:{}
  };
  this.oneset;
  this.targetElement;
  this.DIC_URL = "bower_components/kuromoji/dist/dict/";
  this.tokenizer;
  this.init = function(_planText,_oneset,_targetElement){
    this.data.planText = _planText;
    this.oneset = _oneset || 5;
    this.targetElement = $(_targetElement);
  }
  this.setProblem = function(){
    this.targetElement.html("");
    this.data.tokenize = this.tokenizer.tokenize(this.data.planText);
    var _wrap = $('<div>').addClass('problem');
    var k = 1;
    for (var j = 0; j < this.data.tokenize.length; j++) {
      if(k % this.oneset == 0 && this.data.tokenize[j].pos != "記号"){
        var _inputprop = {
          type:"text",
          "data-surface":this.data.tokenize[j].surface_form
        }
        _wrap.append($('<input>').attr(_inputprop).addClass('surface'));
        this.targetElement.append(_wrap);
        k++;
      }else{
        _wrap.append($('<span>').html(this.data.tokenize[j].surface_form));
        this.targetElement.append(_wrap);
        if(this.data.tokenize[j].pos != "記号"){
          k++;
        }
      }
    }
  }
  this.check = function(){
    var _problem = $('.problem input');
    var _score = 0;
    _problem.each(function(){
      if($(this).val() == $(this).attr("data-surface")){
        _score++;
      }
    });
    return Math.round(_score/$('.problem input').length*100);
  }
}
closeTest.prototype = kuromoji;


$(function(){
  var _text = $('.testWording textarea').val();
  var closetest = new closeTest();
  closetest.init(_text,6,'.closeTest');
  closetest
    .builder({dicPath:closetest.DIC_URL})
    .build(function (error, tokenizer) {
      closetest.tokenizer = tokenizer;
      closetest.setProblem();
      $('.btn').addClass('active check');
      $('.btn span').html("チェック");
      $('#change').css("color","#00e");
    });

  //ボタン挙動
  $('#change').click(function(){
    if($('.testWording').is(":hidden")){
      $('.testWording,.closeTest').slideToggle();
      $('#score').hide();
      $('.btn span').html("セット");
      $('.btn').addClass('set').removeClass('check');
      $(this).css("color","#ccc");
    }
    return false;
  });

  $('.btnWrap').on('click','.btn.active.set',function(){
    closetest.data.planText = $('.testWording textarea').val();
    closetest.setProblem();
    $(this).removeClass('set').addClass('check');
    $('.btn span').html("チェック");
    $('.testWording,.closeTest').slideToggle();
    $('#score').hide();
    $('#change').css("color","#00e");
    return false;
  });

  $('.btnWrap').on('click','.btn.active.check',function(){
    var _score = closetest.check();
    $('#score span').html(_score);
    if($('#score').is(":hidden")){
      $('#score').slideToggle();
    }
    return false;
  });
});
