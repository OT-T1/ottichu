#%%
import pickle

from bokeh.layouts import gridplot
from bokeh.models import ColumnDataSource, LabelSet, Panel, Tabs
from bokeh.plotting import figure, output_file, show

#%%
# pickle data 불러오기
with open ('all_key_count.pkl', 'rb') as read_file:
	all_data = pickle.load(read_file)

#%%
# 월별 언급량 변화 bokeh로 구현하기
output_file('bokeh_test_netflix.html')

tabs_all = []
tabs_ott = []
p_list = [ []* i for i in range(5) ] 


otts = ['netflix', 'watcha', 'tving', 'wavve', 'coupang']
colors = ['#B9062F', '#FF6EED', '#FFF064', '#5AD2FF', '#1E90FF']

# figure 객체 생성
p_all = figure(plot_width=1600, plot_height=600, x_range=list(all_data.index))
    
for idx, ott in enumerate(otts):
    ott_total = f'{ott}_total'
    ott_key = f'{ott}_key'

    source = ColumnDataSource(
        data = dict(
            date = list(all_data.index), 
            total_count = list(all_data[ott_total]), 
            keyword = list(all_data[ott_key]),
            keyword_void = []
        )
    )

    # all - line drawing
    p_all.line(all_data.index, all_data[f'{ott}_total'], line_width=3, color=colors[idx])
    # all - add layout
    labels_1 = LabelSet(x='date', y='total_count', text='keyword_void',
              x_offset=5, y_offset=5, source=source) #render_mode='canvas'
    p_all.add_layout(labels_1)
    
    

    # ott 5 tabs
    # figure 객체 생성
    p_list[idx] = figure(plot_width=1600, plot_height=600, x_range=list(all_data.index))
    # otts - line, scatter drawing
    p_list[idx].line(all_data.index, all_data[f'{ott}_total'], line_width=3, color=colors[idx])
    p_list[idx].scatter(x = 'date', y = 'total_count', size=8, source=source)
    # otts - add layout
    labels_2 = LabelSet(x='date', y='total_count', text='keyword',
              x_offset=5, y_offset=5, source=source) #render_mode='canvas'
    p_list[idx].add_layout(labels_2)
    # otts - make panel and add tab
    p_list[idx] = gridplot([[p_list[idx]]])
    tabs_ott.append(Panel(child = p_list[idx], title = f'{ott}'))


p_all = gridplot([[p_all]])
tabs_all.append(Panel(child=p_all, title='all'))


tabs = tabs_all + tabs_ott

show(Tabs(tabs = tabs))


#%%
