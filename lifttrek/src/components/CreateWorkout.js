import { Button } from '@mui/material';
import React, { useState } from 'react'
import Custom from './workoutforms/Custom';
import Random from './workoutforms/Random';

function CreateWorkout() {

    const [type, setType] = useState('');

    return (
        <div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} className='createWrapper'>
                <h2>Create Workout</h2>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => {setType('custom')}} variant='contained' id='blueButton'>Custom</Button>
                    <Button style={{ marginLeft: '10px' }} onClick={() => {setType('random')}} variant='contained' id='blueButton'>Randomized</Button>
                </div>
            </div>
            <div className='createWrapper'>
                {type === 'custom'
                ?   <Custom />
                :   <></>
                }
                {type === 'random'
                ?   <Random />
                :   <></>
                }
            </div>
        </div>
    )
}

export default CreateWorkout