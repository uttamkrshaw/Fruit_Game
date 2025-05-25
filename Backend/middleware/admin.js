import jwt from 'jsonwebtoken'
export const AdminAuthentication = async (req, res, next) => {
    try {
        if (!!req.headers?.authorization) {
            const token = req.headers?.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SecretKey)
            if (decoded) {
                if (decoded?.type === 'Admin') {
                    next();

                } else {
                    return res.json({ status: 'error', message: `You Don't have Admin Right's!` })
                }
            } else {
                return res.json({ status: 'error', message: 'Token Expired Please Login Again' })
            }
        } else {
            return res.json({ status: 'error', message: 'No Token Found In Headers' })
        }
    } catch (error) {
        return res.json({ status: 'error', message: 'Failed To Verify Token', error: error.message })
    }
}