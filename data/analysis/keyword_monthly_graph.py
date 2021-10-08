#%%
import os
import pickle

import pandas as pd
from bokeh.layouts import gridplot
from bokeh.models import ColumnDataSource, Label, LabelSet
from bokeh.plotting import figure, output_file, show

#%%
# pickle data 불러오기
with open ('all_key_count.pkl', 'rb') as read_file:
	all_data = pickle.load(read_file)


#%%
# 월별 언급량 변화 bokeh로 구현하기

otts = ['netflix', 'watcha', 'tving', 'wavve', 'coupang']

output_file('bokeh_test_netflix.html')
lst = []

# netflix, watcha, tving, wavve, coupang
colors = ['#B9062F', '#FF6EED', '#FFF064', '#5AD2FF', '#1E90FF']

for idx, ott in enumerate(otts):
    ott_total = f'{ott}_total'
    ott_key = f'{ott}_key'

    # figure 객체 생성
    
    p = figure(plot_width=1600, plot_height=600, x_range=list(all_data.index))

    source = ColumnDataSource(
        data = dict(
            date = list(all_data.index), 
            total_count = list(all_data[ott_total]), 
            keyword = list(all_data[ott_key])
        )
    )



    p.scatter(x = 'date', y = 'total_count', size=8, source=source)

    labels = LabelSet(x='date', y='total_count', text='keyword',
              x_offset=5, y_offset=5, source=source, render_mode='canvas')

    citation = Label(
        x=70, y=70, x_units='screen', 
        y_units='screen', render_mode='css', 
        border_line_color='black', border_line_alpha=1.0,background_fill_color='white', background_fill_alpha=1.0
        )

    p.add_layout(labels)
    p.add_layout(citation)

    p.line(all_data.index, all_data[f'{ott}_total'], line_width=3, color=colors[idx])

    lst.append([p])
    gp = gridplot(lst)
    # show(p)
    show(gp)
    break

#%%
