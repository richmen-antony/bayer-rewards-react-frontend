import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core';

export interface StyleProps {
  border?: string;
  background?: string;
  icon? : any;
  children?: any;
  cardClick?: () => void;
 }
  
 const useStyles = makeStyles<Theme, StyleProps>(theme => ({
    root: {
      background: ({ background }) => background ? background : 'black',
      border: ({ border }) => border ? border : 'grey',
      width: '250px',
      height: '250px',
      borderRadius: '20px',
      display: "flex",
     flexDirection: "column",
    justifyContent: "space-between",
    },
    action: {
      fontSize: 14,
     
      marginLeft: '16px'
  },
  iconStyle : {
      marginLeft: '173px',
      marginTop: '20px'
  }
 }));

 /**
 * @Dropdown
 *
 * Defines the Card component. This component is reusable and can be custom
 * rendered with props.
 *
 * @example
 *  import CustomCard from "../../container/components/card";
 *   // With border and background Color props
 *   <CustomCard icon={icon} border = '1px solid #FFA343' background='#FFF4E7'>
 *       <div style={{fontSize : '24px'}}>108</div>
 *       <div style={{fontSize : '18px'}}>Scan Logs</div>
 *   </CustomCard>
**/

export const CustomCard= ({ border, background, icon, children, cardClick }: StyleProps) => {
  const classes = useStyles({ border, background });

  return (
    <div onClick={cardClick} style={{ cursor : cardClick ? 'pointer' : 'auto'}} className="card-dashboard-flex">
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
    </div>
  );
}

export default CustomCard;