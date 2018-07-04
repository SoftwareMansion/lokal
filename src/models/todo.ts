import mongoose from 'mongoose';
import mongooseStringQuery from 'mongoose-string-query';
import timestamps from 'mongoose-timestamp';

const TodoSchema = new mongoose.Schema(
	{
		task: {
			type: String,
			required: true,
			trim: true,
		},
		status: {
			type: String,
			required: true,
			enum: ['pending', 'complete', 'in progress', 'overdue'],
			default: 'pending',
		},
	},
	{ minimize: false },
);

TodoSchema.plugin(timestamps);
TodoSchema.plugin(mongooseStringQuery);

const Todo = mongoose.model('Todo', TodoSchema);
export default Todo;