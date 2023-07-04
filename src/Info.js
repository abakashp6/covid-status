import React from 'react'
import { Card, CardContent, makeStyles, Typography } from '@material-ui/core'

export const Info = ({ title, cases, total, active, caseType, ...props }) => {
    const caseTypes = {
        'cases': "rgba(204, 16, 52, 0.5)",
        'recovered': "rgb(125, 215, 29)",
        'deaths': 'red'
    }
    const color = caseTypes[caseType]
    const classes = makeStyles({
        info: {
            margin: '5px',
            cursor: 'pointer',
            padding: '15px',
            width: '150px'
        },
        info__color: {
            borderTop: '10px solid',
            borderColor: color
        },

        info__content: {
            display: 'flex',
            flexDirection: 'column',
            '&:last-child': {
                padding: '0'
            }
        }
    })()
    return (
        <Card className={`${classes.info} ${active && classes.info__color}`} onClick={props.onclick}>
            <CardContent className={classes.info__content}>
                <Typography>
                    {title}
                </Typography>
                <h2>{cases}</h2>
                <Typography >
                    total: {total}
                </Typography>
            </CardContent>
        </Card>
    )
}
