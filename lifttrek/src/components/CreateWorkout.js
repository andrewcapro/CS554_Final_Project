import { Button } from '@mui/material';
import React, { useState } from 'react'
import Custom from './workoutforms/Custom';
import Random from './workoutforms/Random';

function CreateWorkout() {

    const [type, setType] = useState('');

    return (
        <div>
            <div>
                <h2>Create Workout</h2>     
                <Button style={{ marginLeft: '10px' }} onClick={() => {setType('custom')}} variant='contained' id='blueButton'>Custom</Button>
                <Button style={{ marginLeft: '10px' }} onClick={() => {setType('random')}} variant='contained' id='blueButton2'>Randomized</Button>
            </div>
            <div>
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