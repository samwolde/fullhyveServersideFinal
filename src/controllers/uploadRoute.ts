import * as express from 'express';
import {UploadM} from '../middlewares/uploadImageM';

// router.post('/upload', UploadM.uploadMet);

// router.get('/:imagename', UploadM.getMet);

// module.exports = router;

export class UploadR{
    static init():express.Router{
        let routers:express.Router = express.Router();

        routers.post('/upload', UploadM.uploadMet);
        
        routers.get('/:imagename', UploadM.getMet);

        return routers;
    }
}
