import { type Request, type Response } from 'express'
import { issueService } from './issue.service'
import { userService } from '../User/user.service';
import sendResponse from '../../utilities/sendResponse';

const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;
        const reporter_id = (req as any).user?.id;

        if (!reporter_id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const result = await issueService.createIssueIntoDB({
            title,
            description,
            type,
            reporter_id
        });
        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "Issue created successfully",
            data: result
        })
    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

const getAllIssues = async (req: Request, res: Response) => {
    try {
        const { sort, type, status } = req.query;
        const result = await issueService.getAllIssuesFromDB(
            (sort as string) || 'newest',
            type as string,
            status as string
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "All issues fetched successfully",
            data: result.rows
        })

    } catch (error: any) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: error.message,
            error: error
        })
    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await issueService.getSingleIssueFromDB(Number(id))

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            })
        }

        const issue = result.rows[0];
        const userResult = await userService.getSingleUserFromDB(issue.reporter_id);
        const user = userResult.rows[0];

        const formattedIssue = {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: {
                id: user.id,
                name: user.name,
                role: user.role
            },
            created_at: issue.created_at,
            updated_at: issue.updated_at
        };

        res.status(200).json({
            success: true,
            data: formattedIssue
        })

    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
}

const updateIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const existingIssueResult = await issueService.getSingleIssueFromDB(Number(id));

        if (existingIssueResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        const existingIssue = existingIssueResult.rows[0];

        const loggedInUserId = (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (!loggedInUserId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        if (userRole === 'contributor') {
            if (existingIssue.reporter_id !== loggedInUserId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to update this issue"
                });
            }
            if (existingIssue.status !== 'open') {
                return res.status(403).json({
                    success: false,
                    message: "You can only update issues with an 'open' status"
                });
            }
        }


        const result = await issueService.updateIssueInDB(Number(id), req.body);

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            data: result
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const userRole = (req as any).user?.role;
        if (userRole !== 'maintainer') {
            return res.status(403).json({
                success: false,
                message: "You are not maintainer to delete this issue"
            });
        }

        const result = await issueService.deleteIssueFromDB(Number(id));

        res.status(200).json({
            success: true,
            message: "Issue deleted successfully"
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            error: error
        })
    }
}

export const issueController = {
    createIssue,
    getAllIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}