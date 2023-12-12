import {
  Agenda,
  Day,
  Inject,
  Month,
  ScheduleComponent,
  TimelineViews,
  ViewDirective,
  ViewsDirective,
  Week,
  WorkWeek,
} from '@syncfusion/ej2-react-schedule';
import { useEffect, useRef } from 'react';
import './index.css';

import { Internationalization, extend } from '@syncfusion/ej2-base';
import { updateSampleSection } from './sample-base';
/**
 * Schedule local data sample
 */
import { registerLicense } from '@syncfusion/ej2-base';
import { useModel } from '@umijs/max';
import { isOverdue } from '@/utils';
registerLicense(
'Ngo9BigBOggjHTQxAR8/V1NGaF5cXmdCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdgWH1fcnRQQmZcWUBzX0I='
  );

const convertColor = (task:Task) => {
 const { priority,status}=task
 if(isOverdue(task)) return '#c1beb9'
  switch (priority) {
    case 1:
      if (status === 3) return '#16a34a80'
      return '#16a34a';
      case 2:
        if (status === 3) return '#f2bd2782'
        return '#F2BD27';
    case 3:
      if (status === 3) return '#ed393996'
      return '#ED3939';
  }
};

const Schedule = () => {
  const { listTask } = useModel('listTask');
  useEffect(() => {
    updateSampleSection();
  }, [listTask]);
  const scheduleObj = useRef(null);
  const instance: Internationalization = new Internationalization();
  const data = extend(
    [],
    listTask.map((task) => {
      return {
        id: task.id,
        Subject: task.name,
        StartTime: task.startTime,
        EndTime: task.endTime,
        CategoryColor: convertColor(task),
        test: task,
      };
    }),
    null,
    true,
  );
  const getTimeString = (value: Date) => {
    return instance.formatDate(value, { skeleton: 'hm' });
  };
  const eventTemplate = (props) => {
    return (
      <div className="template-wrap">
        
        <div className="subject">{props.Subject}</div>
      </div>
    );
  };
  const onEventRendered = (args) => {
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) {
      return;
    }
    if (scheduleObj.current.currentView === 'Agenda') {
      args.element.firstChild.style.borderLeftColor = categoryColor;
    } else {
      args.element.style.backgroundColor = categoryColor;
    }
  };
  const onPopupOpen = (args) => {
    console.log('onPopupOpen', args);
    if (args.type === 'QuickInfo') {
      args.cancel = true;
    }
  };
  return (
    <div className="schedule-control-section">
      <div className="col-lg-12 control-section">
        <div className="control-wrapper">
          <ScheduleComponent
            width="100%"
            height="650px"
            selectedDate={new Date()}
            ref={scheduleObj}
            eventSettings={{ dataSource: data ,eventTemplate:eventTemplate}}
            eventRendered={onEventRendered}
            popupOpen={onPopupOpen}
          >
            <ViewsDirective>
              <ViewDirective option="Month" displayName="Tháng" />
              <ViewDirective option="Week" displayName="Tuần" />
              <ViewDirective option="Day" displayName="Ngày" />
              <ViewDirective option="TimelineDay" displayName="Timeline" />
              <ViewDirective option="Agenda" />
            </ViewsDirective>
            <Inject services={[Day, Week, WorkWeek, TimelineViews, Month, Agenda]} />
          </ScheduleComponent>
        </div>
      </div>
    </div>
  );
};
export default Schedule;
