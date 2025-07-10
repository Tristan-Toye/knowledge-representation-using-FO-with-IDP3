(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("../../lib/codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["../../lib/codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(CodeMirror) {
"use strict";

CodeMirror.defineMode("lua", function(config, parserConfig) {
  var indentUnit = config.indentUnit;

  function prefixRE(words) {
    return new RegExp("^(?:" + words.join("|") + ")", "i");
  }
  function wordRE(words) {
    return new RegExp("^(?:" + words.join("|") + ")$", "i");
  }
  var specials = wordRE(parserConfig.specials || []);

  // long list of standard functions from lua manual
  var builtins = wordRE([
    "_G","_VERSION","assert","collectgarbage","dofile","error","getfenv","getmetatable","ipairs","load",
    "loadfile","loadstring","module","next","pairs","pcall","print","rawequal","rawget","rawset","require",
    "select","setfenv","setmetatable","tonumber","tostring","type","unpack","xpcall",

    "coroutine.create","coroutine.resume","coroutine.running","coroutine.status","coroutine.wrap","coroutine.yield",

    "debug.debug","debug.getfenv","debug.gethook","debug.getinfo","debug.getlocal","debug.getmetatable",
    "debug.getregistry","debug.getupvalue","debug.setfenv","debug.sethook","debug.setlocal","debug.setmetatable",
    "debug.setupvalue","debug.traceback",

    "close","flush","lines","read","seek","setvbuf","write",

    "io.close","io.flush","io.input","io.lines","io.open","io.output","io.popen","io.read","io.stderr","io.stdin",
    "io.stdout","io.tmpfile","io.type","io.write",

    "math.abs","math.acos","math.asin","math.atan","math.atan2","math.ceil","math.cos","math.cosh","math.deg",
    "math.exp","math.floor","math.fmod","math.frexp","math.huge","math.ldexp","math.log","math.log10","math.max",
    "math.min","math.modf","math.pi","math.pow","math.rad","math.random","math.randomseed","math.sin","math.sinh",
    "math.sqrt","math.tan","math.tanh",

    "os.clock","os.date","os.difftime","os.execute","os.exit","os.getenv","os.remove","os.rename","os.setlocale",
    "os.time","os.tmpname",

    "package.cpath","package.loaded","package.loaders","package.loadlib","package.path","package.preload",
    "package.seeall",

    "string.byte","string.char","string.dump","string.find","string.format","string.gmatch","string.gsub",
    "string.len","string.lower","string.match","string.rep","string.reverse","string.sub","string.upper",

    "table.concat","table.insert","table.maxn","table.remove","table.sort"
  ]);
  var keywords = wordRE(["and","break","elseif","false","nil","not","or","return",
                         "true","function", "end", "if", "then", "else", "do",
                         "while", "repeat", "until", "for", "in", "local" ]);

  var indentTokens = wordRE(["function", "if","repeat","do", "\\(", "{"]);
  var dedentTokens = wordRE(["end", "until", "\\)", "}"]);
  var dedentPartial = prefixRE(["end", "until", "\\)", "}", "else", "elseif"]);

  function readBracket(stream) {
    var level = 0;
    while (stream.eat("=")) ++level;
    stream.eat("[");
    return level;
  }

  function normal(stream, state) {
    var ch = stream.next();
    if (ch == "\"" || ch == "'")
      return (state.cur = string(ch))(stream, state);
    if (ch == "[" && /[\[=]/.test(stream.peek()))
      return (state.cur = bracketed(readBracket(stream), "string"))(stream, state);
    if (/\d/.test(ch)) {
      stream.eatWhile(/[\w.%]/);
      return "number";
    }
    if (/[\w_]/.test(ch)) {
      stream.eatWhile(/[\w\\\-_.]/);
      return "variable";
    }
    return null;
  }

  function bracketed(level, style) {
    return function(stream, state) {
      var curlev = null, ch;
      while ((ch = stream.next()) != null) {
        if (curlev == null) {if (ch == "]") curlev = 0;}
        else if (ch == "=") ++curlev;
        else if (ch == "]" && curlev == level) { state.cur = normal; break; }
        else curlev = null;
      }
      return style;
    };
  }

  function string(quote) {
    return function(stream, state) {
      var escaped = false, ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) break;
        escaped = !escaped && ch == "\\";
      }
      if (!escaped) state.cur = normal;
      return "string";
    };
  }

  return {
    startState: function(basecol) {
      return {basecol: basecol || 0, indentDepth: 0, cur: normal};
    },

    token: function(stream, state) {
      if (stream.eatSpace()) return null;
      var style = state.cur(stream, state);
      var word = stream.current();
      if (style == "variable") {
        if (keywords.test(word)) style = "keyword";
        else if (builtins.test(word)) style = "builtin";
        else if (specials.test(word)) style = "variable-2";
      }
      if ((style != "comment") && (style != "string")){
        if (indentTokens.test(word)) ++state.indentDepth;
        else if (dedentTokens.test(word)) --state.indentDepth;
      }
      return style;
    },

    indent: function(state, textAfter) {
      var closing = dedentPartial.test(textAfter);
      return state.basecol + indentUnit * (state.indentDepth - (closing ? 1 : 0));
    },

    lineComment: "//",
    blockCommentStart: "/*",
    blockCommentEnd: "*/"
  };
});

CodeMirror.defineMIME("text/x-lua", "lua");


CodeMirror.defineMode("idpLogic", function(config, parserConfig) {
  config.indentUnit = 4;
  var indentUnit = config.indentUnit;

  var block = ["procedure","namespace","structure","query","term","theory","vocabulary","factlist","include"]
  var keywords = ["type",
                  "partial",
                  "isa",
                  "contains",
                  "extern",
                  "define",
                  "sat",
                  "using",
                  "card",
                  "in",
                  "sum",
                  "prod",
                  "min",
                  "max",
                  "not",
                  "true",
                  "false",
                  "constructed",
                  "from"];
  var operators = "<=> & | -> <- <= => ! ? # =< >= = ~= < > .. :: ~".split(" ");
  var classes = "lEquiv lAnd lOr lMapsTo lDef lLImplies lImplies lForAll lExists keyword lLEQ lGEQ lEQ lNEQ lLT lGT keyword keyword lNot".split(" ");
  return {
    startState: function(basecolumn) {
      var state = {
        n : 0,
        depth : 0
      };
      return state;
    },

    token: function(stream, state) {

      if(stream.match(/^\s+/g,true)){
        return "whitespace";
      }

      if(stream.match(/^\}/g)){
        //Closure of block
        if(state.depth > 0) {
          state.depth --;
        }
        return "bracket";
      }else if(stream.match(/^\{/g)){
        //Closure of block
        state.depth ++;
        return "bracket";
      }else if(stream.match(/^"/g,true)){
          //string literal
          stream.match(/(\\.|[^\\"])*/g,true);
          stream.match(/\"/g,true);
          return "string"
      }
      for(var i in operators){
        if(stream.match(operators[i])){
          state.n++;
          return classes[i]+" "+state.n;
        }
      }

      if (stream.match(/^[^\w\s]/g, true)){
        return "keyword"
      }

      var woordmatch = stream.match(/^\w+/g, true);
      if(woordmatch){
        var cur = woordmatch[0];
        if(block.filter(function(k){return k == cur.toLowerCase();})[0]){
          return "builtin";
        }else if(keywords.filter(function(k){return k == cur;})[0]){
          return "keyword";
        }else {
          return "text";
        }
      }


    },

    indent: function(state, textAfter) {
      if(textAfter[0] == "}"){
        return indentUnit*(state.depth - 1 );
      }else{
        return indentUnit*state.depth
      }
    },

    electricChars: "{}",
    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: "//",
    fold: "brace",

  };
});

CodeMirror.defineMIME("text/x-idpLogic", {name:"idpLogic"});
CodeMirror.defineMIME("application/idpLogic", {name:"idpLogic"});


CodeMirror.defineMode("idp", function(config, parserConfig) {
  var idpMode = CodeMirror.getMode(config, "idpLogic");
  var luaMode = CodeMirror.getMode(config, "lua");
  function curState(state){
    if(state.currentIDP){
      return state.idpState;
    }else{
      return state.luaState;
    }
  }
  function curMode(state){
    if(state.currentIDP){
      return idpMode;
    }else{
      return luaMode;
    }
  }

  return {
    startState: function() {
      var state = {currentIDP : true, idpState : idpMode.startState(), luaState : luaMode.startState(4), comment : 0, nextLua : false};
      return state; //{token: html, localMode: null, localState: null, htmlState: state};
    },
    copyState: function(state) {

      return {currentIDP : state.currentIDP,
              idpState : CodeMirror.copyState(idpMode,state.idpState),
              luaState : CodeMirror.copyState(luaMode,state.luaState),
              comment : state.comment,
              nextLua : state.nextLua};
    },

    token: function(stream, state) {
      if(state.comment>0){
        if(stream.match(/.*?\*\//g)){
          state.comment--;
          return "comment";
        }else{
          stream.skipToEnd();
          return "comment";
        }
      }

      if(stream.match(/^\/\//g,true)){
          //Line Comment
          stream.skipToEnd();
          return "comment"
        }else if(stream.match(/^\/\*+/g)){
          //Start of block comment
          state.comment ++;
          return "comment"
        }
        if(!state.currentIDP && state.luaState.indentDepth == 0 && stream.match(/\s*}/g,false)){
          state.currentIDP = true;
        }


      var out =  curMode(state).token(stream, curState(state));
      if(state.currentIDP && state.nextLua && stream.current() == "{"){
        state.nextLua = false;
        state.currentIDP = false;
      } else if(state.currentIDP && state.idpState.depth == 0 && stream.current() == "procedure"){
        state.nextLua = true;
      }
      return out;
    },

    indent: function(state, textAfter) {
      return curMode(state).indent(curState(state),textAfter);
    }
  };
}, "idpLogic", "lua");


CodeMirror.defineMIME("text/x-idp", {name:"idp"});
CodeMirror.defineMIME("application/idp", {name:"idp"});

});
