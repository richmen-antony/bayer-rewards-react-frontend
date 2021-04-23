import React from 'react';
import { makeStyles, withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { AnySrvRecord } from 'node:dns';

export interface CardTypes  {
    outlineColor? : any;
    icon? : any;
    children? : any;
}

const useStyles = makeStyles({
  root: {
      width: '250px',
      height: '250px',
      border :  (props:any) =>  props.outlineColor ? `10px solid ${props.outlineColor}` : '10px solid pink',
      borderRadius: '4px',
      backgroundColor: (props:any) => props.outlineColor ? props.outlineColor : 'green'
  },
  action: {
      fontSize: 14,
      marginTop: '95px',
      marginLeft: '16px'
  },
  iconStyle : {
      marginLeft: '173px',
      marginTop: '20px'
  }
});

export const SimpleCard = ({children,icon, outlineColor, ...props}: CardTypes) => {
  const classes = useStyles(props);
  // console.log('cardprops', CardTypes);

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
          <div className={classes.iconStyle}>
            <img src={icon} width="30" alt=""/>
          </div>
      </CardContent>
      <CardActions>
         <Typography className={classes.action} color="textSecondary" gutterBottom>
           {children}
        </Typography>
      </CardActions>
    </Card>
  );
}

export default SimpleCard;