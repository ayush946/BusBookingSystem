import React from "react";

function BusView ({busData}) {
    console.log("busView is called! ")
    let data = JSON.parse(busData.busMatrix);
    return (
        <div>
            {
                data.map((row, rowIndex) => (
                    <div key = {rowIndex} style={{display: 'flex', justifyContent: "center"}}>
                        {
                            row.map( (seat, seatIndex) => (
                                <div key={seatIndex} style={{
                                    width: '30px',
                                    height: '30px',
                                    backgroundColor: seat ? 'red' : 'green',
                                    margin: '5px',
                                }}>
                                {rowIndex * busData.width + seatIndex + 1}
                                </div>
                            ))
                        }
                    </div>
                 ) )
            }
        </div>
    )
}
export default BusView;