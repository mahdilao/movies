// ���빤��ģ��
var mongoose = require('mongoose')

var Schema = mongoose.Schema

var ObjectId = Schema.Types.ObjectId
// �����ֶμ��ֶ�����
var CategorySchema = new Schema({
	name:String,
	movies:[{
		type: ObjectId,
		ref: 'Movie'
	}],
	meta: {
		createAt:{
			type: String,
			default: Date().toLocaleString() // ����Ĭ��ֵ ��ǰʱ��
		},
		updateAt:{
			type: String,
			default: Date().toLocaleString()
		}
	}
})

// ÿ�δ洢����ʱ��������������
CategorySchema.pre('save',function (next) {
	if(this.isNew) {	// �ж������Ƿ����¼ӵ�
		this.meta.createAt = this.meta.updateAt = Date().toLocaleString()  // ������ʱ�����ʱ�䶼����Ϊ��ǰʱ��
	}else{
		this.meta.updateAt = Date().toLocaleString()  // ����ֻ�޸ĸ���ʱ��
	}
	next()
})

CategorySchema.statics = {
	fetch: function(cb){
		return this
		.find({})
		.sort('meta.updateAt')
		.exec(cb)
	},   //ȡ�����ݿ�����������
	findById: function(id, cb){
		return this
		.findOne({_id: id})
		.exec(cb)
	}   //ȡ����������
}

// ����ģʽ
module.exports = CategorySchema