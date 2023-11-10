import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import TimeAgo from 'react-timeago'


export default function getago(date,transcript){
    const timeAgoFormatConfig = {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: '',
        suffixFromNow: 'from now',
        seconds: '%d ' + transcript.second,
        minutes: '%d ' + transcript.minute,
        hour: '%d ' + transcript.hour,
        hours: '%d ' + transcript.hour,
        day: '%d ' + transcript.day,
        days: '%d ' + transcript.day,
        wordSeparator: ' ',
      }
    
    const timeAgoFormatter = buildFormatter(timeAgoFormatConfig)

    return(
        <>
            <TimeAgo formatter={timeAgoFormatter} date={date} />
        </>
    )
}