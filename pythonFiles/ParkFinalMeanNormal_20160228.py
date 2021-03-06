
# coding: utf-8


#Import the libraries
import pandas as pd
import numpy as np
import time, holidays
import statsmodels.api as sm
import matplotlib.pylab as plt
import statsmodels.graphics.tsaplots as tsaplots
from collections import Counter, OrderedDict
from datetime import date, datetime, timedelta



#Define the function
def perdelta(start, end, delta):
    curr = start
    while curr < end:
        yield curr
        curr += delta



#Import the data
data=pd.read_csv(r"C:\Users\zydong\Desktop\transactions.csv")



#Data processing
EntryTimeList=[]
ExitTimeList=[]
for i in range(len(data)):
    EntryTime=data["entry_time"][i][:-6]
    EntryTime=datetime.strptime(EntryTime, "%Y-%m-%d %H")
    ExitTime=data["exit_time"][i][:-6]
    ExitTime=datetime.strptime(ExitTime, "%Y-%m-%d %H")    
    EntryTimeList.append(EntryTime)
    ExitTimeList.append(ExitTime)
data["EntryTime"]=EntryTimeList
data["ExitTime"]=ExitTimeList

IntervalList=[]
for i in range(len(data)):
    for result in perdelta(data["EntryTime"][i].to_datetime(), data["ExitTime"][i].to_datetime()+timedelta(hours=1), timedelta(hours=1)):
        IntervalList.append(result)

ParkCount=dict(Counter(IntervalList))
ParkCountData1=pd.DataFrame(list(ParkCount.items()),columns=["time","count"])  
ParkCountData1=ParkCountData1.sort(["time"])
ParkCountData1.index = range(len(ParkCountData1))

IntervalList=[]
for result in perdelta(ParkCountData1["time"][0].to_datetime(), ParkCountData1["time"][len(ParkCountData1)-1].to_datetime()+timedelta(hours=1), timedelta(hours=1)):
    IntervalList.append(result)

ParkCountData2=pd.DataFrame({"time":IntervalList})
ParkCountData=pd.merge(ParkCountData1,ParkCountData2, on="time", how="outer", sort=True)
ParkCountData["count"].fillna(0,inplace=True)

YearList=[]
MonthList=[]
DayList=[]
HourList=[]
MinuteList=[]
WeekDayList=[]
HolidayList=[]

us_holidays = holidays.UnitedStates() 

for i in range(len(ParkCountData)):
    year=ParkCountData["time"][i].to_datetime().year
    YearList.append(year)
    month=ParkCountData["time"][i].to_datetime().month
    MonthList.append(month)
    day=ParkCountData["time"][i].to_datetime().day
    DayList.append(day)
    hour=ParkCountData["time"][i].to_datetime().hour
    HourList.append(hour)
    weekday=ParkCountData["time"][i].to_datetime().weekday()
    WeekDayList.append(weekday)
    holiday=int(ParkCountData["time"][i].to_datetime().date() in us_holidays)
    HolidayList.append(holiday)

ParkCountData["year"]=YearList
ParkCountData["month"]=MonthList
ParkCountData["day"]=DayList
ParkCountData["hour"]=HourList
ParkCountData["weekday"]=WeekDayList
ParkCountData["holiday"]=HolidayList



ParkCountDataBase=ParkCountData[ParkCountData["year"]>=2014].reset_index()
CountMean=ParkCountDataBase.groupby(['weekday','hour', 'holiday'])['count'].mean()
CountMeanData=CountMean.to_frame().reset_index()
CountMeanData



#Prediction
DateTimeList=[]
for result in perdelta(datetime(2016,2,1,0), datetime(2016,3,1,0), timedelta(hours=1)):
    DateTimeList.append(result)
ParkCountPred=pd.DataFrame({"time":DateTimeList})

YearList=[]
MonthList=[]
DayList=[]
HourList=[]
MinuteList=[]
WeekDayList=[]
HolidayList=[]

us_holidays = holidays.UnitedStates() 


for i in range(len(ParkCountPred)):
    year=ParkCountPred["time"][i].to_datetime().year
    YearList.append(year)
    month=ParkCountPred["time"][i].to_datetime().month
    MonthList.append(month)
    day=ParkCountPred["time"][i].to_datetime().day
    DayList.append(day)
    hour=ParkCountPred["time"][i].to_datetime().hour
    HourList.append(hour)
    weekday=ParkCountPred["time"][i].to_datetime().weekday()
    WeekDayList.append(weekday)
    holiday=int(ParkCountPred["time"][i].to_datetime().date() in us_holidays)
    HolidayList.append(holiday)
    
    
ParkCountPred["year"]=YearList
ParkCountPred["month"]=MonthList
ParkCountPred["day"]=DayList
ParkCountPred["hour"]=HourList
ParkCountPred["weekday"]=WeekDayList
ParkCountPred["holiday"]=HolidayList



CountPredList=[]
for i in range(len(ParkCountPred)):
    CountMean=CountMeanData['count'][(CountMeanData["weekday"]==ParkCountPred["weekday"][i]) & (CountMeanData["hour"]==ParkCountPred["hour"][i])& (CountMeanData["holiday"]==ParkCountPred["holiday"][i])]
    CountPred=int(np.random.normal(loc=CountMean))
    if CountPred<=10:
        CountPred=35
    CountPredList.append(CountPred)
ParkCountPred["count_pred"]=CountPredList
ParkCountPred.to_csv(r"C:\Users\zydong\Desktop\ParkCountPredMeanNormal201602.csv")



#Evaluation
ParkCountDataEval=ParkCountData[25000:]
ParkCountDataEval=ParkCountDataEval.reset_index()
ParkCountDataBase=ParkCountData[:25000]
ParkCountDataBase=ParkCountData[ParkCountData["year"]>=2014].reset_index()
CountMean=ParkCountDataBase.groupby(['weekday','hour', 'holiday'])['count'].mean()
CountMeanData=CountMean.to_frame().reset_index()
CountPredList=[]
for i in range(len(ParkCountDataEval)):
    CountMean=CountMeanData['count'][(CountMeanData["weekday"]==ParkCountDataEval["weekday"][i]) & (CountMeanData["hour"]==ParkCountDataEval["hour"][i]) & (CountMeanData["holiday"]==ParkCountDataEval["holiday"][i])]
    CountPred=int(np.random.normal(loc=CountMean))
    if CountPred<=10:
        CountPred=35
    CountPredList.append(CountPred)
ParkCountDataEval["count_pred"]=CountPredList
ParkCountDataEval.to_csv(r"C:\Users\zydong\Desktop\ParkCountEvalMeanNormal201602.csv")

