import React from 'react'
import { Box, makeStyles, TableRow, TableCell, Table, TableHead, TableBody, Card } from '@material-ui/core'
import numeral from "numeral";

export const CountryTable = ({ tableData }) => {

    const classes = makeStyles({
        table: {
            '&>table>tbody>tr:nth-child(odd)': {
                background: "#f2f7f4"
            },
            height: '400px',
            overflowY: 'scroll',
            marginBottom:'10px'
        }
    })()

    tableData.sort((a, b) => a.cases > b.cases ? -1 : 1)

    return (
        <Card className={classes.table}>
            <Box component='h2'>Live cases by countries</Box>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>CountryName</TableCell>
                        <TableCell>Cases</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        tableData.map(iter => (
                            <TableRow key={iter.country}>
                                <TableCell>{iter.country}</TableCell>
                                <TableCell>{numeral(iter.cases).format('0,0')}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </Card>
    )
}