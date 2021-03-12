import os

from flask import Flask, request, Response, json, jsonify
from flask_caching import Cache
import requests
import csv
import math

cache = Cache(config={'CACHE_TYPE': 'SimpleCache'})
app = Flask(__name__)
cache.init_app(app)

@app.route('/')
def hello_world():
    return 'Hello!\n'

@cache.cached(timeout=5000, key_prefix='WxAccessToken')
def getAccessToken():
    url = f"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid={os.getenv('APPID')}&secret={os.getenv('SECRET')}"
    response = requests.request("GET", url)
    response = json.loads(response.text)
    return response['access_token']

@cache.cached(timeout=86400, key_prefix='MainData')
def getMainData():
    url = f"https://api.weixin.qq.com/tcb/invokecloudfunction?access_token={getAccessToken()}&env=chake-7g37b76526c08c7a&name=getUserTagList"

    response = requests.request("POST", url)
    response = json.loads(response.text)

    if (response['errcode'] != 0):
        raise Exception(response['errmsg'])

    return json.loads(response['resp_data'])

def genData(user):
    DB_URL = f"https://api.weixin.qq.com/tcb/databaseaggregate?access_token={getAccessToken()}"
    userDataPostBody = "{\r\n  \"env\":\"chake-7g37b76526c08c7a\",\r\n  \"query\": \"db.collection('TestcmtCourses').aggregate().match({student: '"+ user +"',}).unwind('$tag').unwind('$teacher').project({_id: 0,class: $.concat(['$class', '&', '$teacher']),student: 1,tag: 1,}).end()\"\r\n}"
    ur = requests.post(DB_URL, data=userDataPostBody)
    ur = json.loads(ur.text)
    if (ur['errcode'] != 0):
        raise Exception(ur['errmsg'])

    userdata = list(map(json.loads, ur['data']))

    return userdata + getMainData()
 
def getUItem_label(data):
    UI_label=dict()
    for r in data:
        user= r['student']
        item= r['class']
        label= r['tag']
        addToMat(UI_label,(user,item),label)
    #print("UI_label successed!")
    data=UI_label.keys()
    train=[]
    for user,item in data:
        for label in UI_label[(user, item)]:
            train.append((user,item,label))
    return train
  
def addToMat(d,x,y):
    d.setdefault(x,[ ]).append(y)
 
def buildGrapha(record):
    graph=dict()
    user_tags = dict()
    tag_items = dict()
    user_items = dict()
    item_tags = dict()
    for user, item, tag in record:
        if user not in graph:
            graph[user]=dict()
        if item not in graph[user]:
            graph[user][item]=1
        else:
            graph[user][item]+=1
 
        if item not in graph:
            graph[item]=dict()
        if user not in graph[item]:
            graph[item][user]=1
        else:
            graph[item][user]+=1
 
        if user not in user_items:
            user_items[user]=dict()
        if item not in user_items[user]:
            user_items[user][item]=1
        else:
            user_items[user][item]+=1
 
        if user not in user_tags:
            user_tags[user]=dict()
        if tag not in user_tags[user]:
            user_tags[user][tag]=1
        else:
            user_tags[user][tag]+=1
 
        if tag not in tag_items:
            tag_items[tag]=dict()
        if item not in tag_items[tag]:
            tag_items[tag][item]=1
        else:
            tag_items[tag][item]+=1
 
        if item not in item_tags:
            item_tags[item]=dict()
        if tag not in item_tags[item]:
            item_tags[item][tag]=1
        else:
            item_tags[item][tag]+=1
 
    return graph,user_items,user_tags,tag_items,item_tags

def GetRecommendation(G,alpha,root,max_depth,N,user_items):
    rank=dict()
    rank={x:0 for x in G.keys()}
    rank[root]=1
    #开始迭代
    for k in range(max_depth):
        tmp={x:0 for x in G.keys()}
        #取出节点i和他的出边尾节点集合ri
        for i,ri in G.items():
            #取节点i的出边的尾节点j以及边E(i,j)的权重wij,边的权重都为1，归一化后就是1/len(ri)
            for j,wij in ri.items():
                tmp[j]+=alpha*rank[i]*(wij/(1.0*len(ri)))
        tmp[root]+=(1-alpha)
        rank=tmp
    lst=sorted(rank.items(),key=lambda x:x[1],reverse=True)
    items=[]
    for i in range(N):
        item=lst[i][0]
        if '&' in item and item not in user_items[root]:
            items.append(item)
    return items

def Covert2RecommendJson(rec):
    rs = rec.split('&')
    return {'class':rs[0], 'teacher': rs[1].split('/')}

@app.route('/recommend/<user>', methods=["GET"])
def recommend(user):
    data = genData(user)
    train = getUItem_label(data)
    N=20;max_depth=50;alpha=0.8
    G, user_items, user_tags, tag_items, item_tags=buildGrapha(train)

    rec = GetRecommendation(G,alpha,user,max_depth,N,user_items)
    result = list(map(Covert2RecommendJson, rec))
    return jsonify(result)
    # return str(rec)

if __name__ == "__main__":
    app.config['JSON_AS_ASCII'] = False
    app.run(host='0.0.0.0',port=int(os.environ.get('PORT', 80)))
