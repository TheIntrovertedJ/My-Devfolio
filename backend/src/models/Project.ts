import { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
	title: string;
	description: string;
	url: string;
	imageUrl?: string;
	tags: string[];
	featured: boolean;
	createdAt: Date;
	updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
	{
		title: {
			type: String,
			required: [true, 'Project title is required'],
			trim: true,
			maxlength: [100, 'Title cannot exceed 100 characters'],
		},
		description: {
			type: String,
			required: [true, 'Project description is required'],
			trim: true,
			maxlength: [1000, 'Description cannot exceed 1000 characters'],
		},
		url: {
			type: String,
			required: [true, 'Project URL is required'],
			match: [
				/^https?:\/\/.+/,
				'Please provide a valid URL starting with http or https',
			],
		},
		imageUrl: {
			type: String,
			default: null,
			match: [
				/^https?:\/\/.+/,
				'Please provide a valid image URL',
			],
		},
		tags: {
			type: [String],
			default: [],
			validate: {
				validator: (tags: string[]) => tags.length <= 10,
				message: 'Cannot add more than 10 tags',
			},
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

export const Project = model<IProject>('Project', projectSchema);
