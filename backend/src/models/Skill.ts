import { Document, Schema, model } from 'mongoose';

export interface ISkill extends Document {
	name: string;
	category: 'language' | 'framework' | 'tool' | 'database' | 'other';
	proficiency: number;
	createdAt: Date;
}

const skillSchema = new Schema<ISkill>(
	{
		name: {
			type: String,
			required: [true, 'Skill name is required'],
			trim: true,
			maxlength: [50, 'Skill name cannot exceed 50 characters'],
			unique: true,
		},
		category: {
			type: String,
			enum: {
				values: ['language', 'framework', 'tool', 'database', 'other'],
				message: 'Invalid skill category',
			},
			required: [true, 'Category is required'],
		},
		proficiency: {
			type: Number,
			required: [true, 'Proficiency level is required'],
			min: [1, 'Proficiency must be at least 1'],
			max: [5, 'Proficiency cannot exceed 5'],
		},
	},
	{
		timestamps: true,
	}
);

export const Skill = model<ISkill>('Skill', skillSchema);
