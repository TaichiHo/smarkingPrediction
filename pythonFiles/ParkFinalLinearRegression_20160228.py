
# coding: utf-8


#Import the libraries
import time, holidays
import pandas as pd
import numpy as np
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

for elem in ParkCountData['month'].unique():
    ParkCountData["month_"+str(elem)] = ParkCountData['month'] == elem
for elem in ParkCountData['weekday'].unique():
    ParkCountData["weekday_"+str(elem)] = ParkCountData['weekday'] == elem
for elem in ParkCountData['hour'].unique():
    ParkCountData["hour_"+str(elem)] = ParkCountData['hour'] == elem
ParkCountData["year_dummy"]= ParkCountData['year']>2013
ParkCountData


#Linear Regression
y=list(ParkCountData["count"])
x = [
     list(ParkCountData["year"]),
     list(ParkCountData["year_dummy"]),
     list(ParkCountData["holiday"]*1),
     list(ParkCountData["month_1"]*1),
     list(ParkCountData["month_2"]*1),
     list(ParkCountData["month_3"]*1),
     list(ParkCountData["month_4"]*1),
     list(ParkCountData["month_5"]*1),
     list(ParkCountData["month_6"]*1),
     list(ParkCountData["month_7"]*1),
     list(ParkCountData["month_8"]*1),
     list(ParkCountData["month_9"]*1),
     list(ParkCountData["month_10"]*1),
     list(ParkCountData["month_11"]*1),
     list(ParkCountData["weekday_0"]*1),
     list(ParkCountData["weekday_1"]*1),
     list(ParkCountData["weekday_2"]*1),
     list(ParkCountData["weekday_3"]*1),     
     list(ParkCountData["weekday_4"]*1),
     list(ParkCountData["weekday_5"]*1),
     list(ParkCountData["hour_0"]*1),
     list(ParkCountData["hour_1"]*1),
     list(ParkCountData["hour_2"]*1),
     list(ParkCountData["hour_3"]*1),
     list(ParkCountData["hour_4"]*1),
     list(ParkCountData["hour_5"]*1),    
     list(ParkCountData["hour_6"]*1),
     list(ParkCountData["hour_7"]*1),    
     list(ParkCountData["hour_8"]*1),    
     list(ParkCountData["hour_9"]*1),    
     list(ParkCountData["hour_10"]*1),    
     list(ParkCountData["hour_11"]*1), 
     list(ParkCountData["hour_12"]*1),     
     list(ParkCountData["hour_13"]*1),     
     list(ParkCountData["hour_14"]*1),     
     list(ParkCountData["hour_15"]*1),     
     list(ParkCountData["hour_16"]*1),     
     list(ParkCountData["hour_17"]*1), 
     list(ParkCountData["hour_18"]*1),     
     list(ParkCountData["hour_19"]*1),     
     list(ParkCountData["hour_20"]*1), 
     list(ParkCountData["hour_21"]*1),     
     list(ParkCountData["hour_22"]*1),    
     ]

ones = np.ones(len(x[0]))
X = sm.add_constant(np.column_stack((x[0], ones)))
for i in x[1:]:
    X = sm.add_constant(np.column_stack((i, X)))
reg=sm.OLS(y, X).fit()



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

for elem in range(1,13):
    ParkCountPred["month_"+str(elem)] = ParkCountPred['month'] == elem
for elem in ParkCountPred['weekday'].unique():
    ParkCountPred["weekday_"+str(elem)] = ParkCountPred['weekday'] == elem
for elem in ParkCountPred['hour'].unique():
    ParkCountPred["hour_"+str(elem)] = ParkCountPred['hour'] == elem
ParkCountPred["year_dummy"]= ParkCountPred['year']>2013

x_pred = [
     list(ParkCountPred["year"]),
     list(ParkCountPred["year_dummy"]),
     list(ParkCountPred["holiday"]*1),
     list(ParkCountPred["month_1"]*1),
     list(ParkCountPred["month_2"]*1),
     list(ParkCountPred["month_3"]*1),
     list(ParkCountPred["month_4"]*1),
     list(ParkCountPred["month_5"]*1),
     list(ParkCountPred["month_6"]*1),
     list(ParkCountPred["month_7"]*1),
     list(ParkCountPred["month_8"]*1),
     list(ParkCountPred["month_9"]*1),
     list(ParkCountPred["month_10"]*1),
     list(ParkCountPred["month_11"]*1),
     list(ParkCountPred["weekday_0"]*1),
     list(ParkCountPred["weekday_1"]*1),
     list(ParkCountPred["weekday_2"]*1),
     list(ParkCountPred["weekday_3"]*1),     
     list(ParkCountPred["weekday_4"]*1),
     list(ParkCountPred["weekday_5"]*1),
     list(ParkCountPred["hour_0"]*1),
     list(ParkCountPred["hour_1"]*1),
     list(ParkCountPred["hour_2"]*1),
     list(ParkCountPred["hour_3"]*1),
     list(ParkCountPred["hour_4"]*1),
     list(ParkCountPred["hour_5"]*1),    
     list(ParkCountPred["hour_6"]*1),
     list(ParkCountPred["hour_7"]*1),    
     list(ParkCountPred["hour_8"]*1),    
     list(ParkCountPred["hour_9"]*1),    
     list(ParkCountPred["hour_10"]*1),    
     list(ParkCountPred["hour_11"]*1), 
     list(ParkCountPred["hour_12"]*1),     
     list(ParkCountPred["hour_13"]*1),     
     list(ParkCountPred["hour_14"]*1),     
     list(ParkCountPred["hour_15"]*1),     
     list(ParkCountPred["hour_16"]*1),     
     list(ParkCountPred["hour_17"]*1), 
     list(ParkCountPred["hour_18"]*1),     
     list(ParkCountPred["hour_19"]*1),     
     list(ParkCountPred["hour_20"]*1), 
     list(ParkCountPred["hour_21"]*1),     
     list(ParkCountPred["hour_22"]*1),    
     ]

ones = np.ones(len(x_pred[0]))
X_pred = sm.add_constant(np.column_stack((x_pred[0], ones)))
for i in x_pred[1:]:
    X_pred = sm.add_constant(np.column_stack((i, X_pred)))
y_pred=list(reg.predict(exog=X_pred))
y_pred = list(map(int, y_pred))
for n,i in enumerate(y_pred):
    if i<=10:
        y_pred[n]=35
        
ParkCountPred201602=pd.DataFrame({"datetime":list(ParkCountPred["time"]),"count_pred":y_pred,"year":list(ParkCountPred["year"]),"month":list(ParkCountPred["month"]),"day":list(ParkCountPred["day"]),"weekday":list(ParkCountPred["weekday"]),"holiday":list(ParkCountPred["holiday"]),"hour":list(ParkCountPred["hour"])})
ParkCountPred201602.to_csv(r"C:\Users\zydong\Desktop\ParkCountPredLinearReg201602.csv")



#Evaluation
y_train=y[:26000]
y_true=y[26000:]
x_train=[]
for i in range(len(x)):
    x_train.append(x[i][:26000])
ones_train = np.ones(len(x_train[0]))
X_train = sm.add_constant(np.column_stack((x_train[0], ones_train)))
for i in x_train[1:]:
    X_train = sm.add_constant(np.column_stack((i, X_train)))
reg=sm.OLS(y_train, X_train).fit()

x_test=[]
for i in range(len(x)):
    x_test.append(x[i][26000:])
ones_test = np.ones(len(x_test[0]))
X_test = sm.add_constant(np.column_stack((x_test[0], ones_test)))
for i in x_test[1:]:
    X_test = sm.add_constant(np.column_stack((i, X_test)))


y_test=list(reg.predict(exog=X_test))
y_test = list(map(int, y_test))
for n,i in enumerate(y_test):
    if i<=10:
        y_test[n]=35

datetime_test=ParkCountData["time"][26000:]        
ParkCountEval=pd.DataFrame({"datetime":datetime_test,"y_test":y_test, "y_true":y_true})        
ParkCountEval.to_csv(r"C:\Users\zydong\Desktop\ParkCountEvalLinearReg.csv")
