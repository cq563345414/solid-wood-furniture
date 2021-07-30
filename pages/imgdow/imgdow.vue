<template>
	<view class="container">
		<view class="detail-desc">
			<view class="item-r"  alt=""  @click="choosed(item,index)" :key="index" v-for="(item,index) in imgList" ref='liId' style="float: left;width:178.125upx;height:178.125upx;margin-top:7.5upx;margin-left:7.5upx;"  >
				<img :src="item.src" width='100%' height="100%">
				<view class='choose' v-if='item.isShow'></view>
			</view>
		</view>
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<view class="p-b-btn" style="background-color: #F0AD4E;" @click="downAll()">
				<text>下载并复制相册描述</text>
			</view>
			<view class="p-b-btn" style="background-color: #DD524D;" @click="imgDow()">
				<text>一键下载</text>
			</view>
		</view>
	</view>
</template>
<script>
	export default{
		components: {
		},
		data() {
			return {
				checkBox: [],    // 选中的内容
				imgList: [
					{
						id:1,
						src: 'https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg',
						isShow:false,
					},
					{
						id:2,
						src: 'https://gd3.alicdn.com/imgextra/i3/TB1RPFPPFXXXXcNXpXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg',
						isShow:false,
					},
					{
						id:3,
						src: 'https://gd2.alicdn.com/imgextra/i2/38832490/O1CN01IYq7gu1UGShvbEFnd_!!38832490.jpg_400x400.jpg',
						isShow:false,
					},
					{
						id:4,
						src: 'https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg',
						isShow:false,
					},
					{
						id:5,
						src: 'https://gd3.alicdn.com/imgextra/i3/TB1RPFPPFXXXXcNXpXXXXXXXXXX_!!0-item_pic.jpg_400x400.jpg',
						isShow:false,
					},
					{
						id:6,
						src: 'https://gd2.alicdn.com/imgextra/i2/38832490/O1CN01IYq7gu1UGShvbEFnd_!!38832490.jpg_400x400.jpg',
						isShow:false,
					}
				],
			};
		},
		async onLoad(options){
		},
		methods:{
			// 多选
			choosed(item,index) {
				var idx = this.checkBox.indexOf(index);
				this.$nextTick(function(){
					if(!this.imgList[index].isShow) {
						// 添加类--选中状态
						this.imgList[index].isShow= true;
						this.checkBox.push(item);
					} else {
						// 选中再取消
						this.imgList[index].isShow= false;
						this.checkBox.splice(idx, 1);
					}
				})
			},
			//图片下载
			imgDow(){
				this.$nextTick(function(){
					this.checkBox.forEach(function(e) {
						uni.downloadFile({
							url: e.src,
							success: (res) => {
								if (res.statusCode === 200) {
									uni.saveImageToPhotosAlbum({
										filePath: res.tempFilePath,
										success: (res) => {
											uni.showToast({
												title: '保存成功' ,
												icon: 'none'
											})
										},
										fail: () => console.log('保存失败')
									 })
								}
							}
						 });
					})
				})
				
			},
			//图片下载并复制文本
			downAll(){
				uni.setClipboardData({
				    data: 'hello',
				    success: function () {
				        console.log('success');
				    }
				});
				this.checkBox.forEach(function(e) {
					uni.downloadFile({
						url: e.src,
						success: (res) => {
							if (res.statusCode === 200) {
								uni.saveImageToPhotosAlbum({
									filePath: res.tempFilePath,
									success: (res) => {
										uni.showToast({
											title: '保存成功' ,
											icon: 'none'
										})
									},
									fail: () => console.log('保存失败')
								 })
							}
						}
					 });
				})
			},
		},
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 32upx;
		clear: both;
		.item-r{
			position: relative;
		}
		.choose::after{
			 content: '✔';
			 display: block;
			 height: 0px;
			 width: 0px;
			 position: absolute;
			 right: 0;
			 bottom: 0;
			 color:#fff;
			 /**对号大小*/
			 font-size: 20upx;
			 line-height: 16upx;
			 border: 20upx solid;
			 border-color: transparent #4884ff #4884ff transparent;
		}
	}
	
	
	/* 底部操作菜单 */
	.page-bottom{
		position:fixed;
		bottom:0;
		z-index: 95;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100upx;
		background: rgba(255,255,255,.9);
		
		.p-b-btn{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			font-size: $font-sm;
			color: #fff;
			width: 500upx;
			height: 100upx;
			.yticon{
				font-size: 40upx;
				line-height: 48upx;
				color: $font-color-light;
			}
			&.active, &.active .yticon{
				color: $uni-color-primary;
			}
			.icon-fenxiang2{
				font-size: 42upx;
				transform: translateY(-2upx);
			}
			.icon-shoucang{
				font-size: 46upx;
			}
		}
		.action-btn-group{
			display: flex;
			height: 76upx;
			border-radius: 100px;
			overflow: hidden;
			box-shadow: 0 20upx 40upx -16upx #fa436a;
			box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
			background: linear-gradient(to right, #ffac30,#fa436a,#F56C6C);
			margin-left: 20upx;
			position:relative;
			&:after{
				content: '';
				position:absolute;
				top: 50%;
				right: 50%;
				transform: translateY(-50%);
				height: 28upx;
				width: 0;
				border-right: 1px solid rgba(255,255,255,.5);
			}
			.action-btn{
				display:flex;
				align-items: center;
				justify-content: center;
				width: 180upx;
				height: 100%;
				font-size: $font-base ;
				padding: 0;
				border-radius: 0;
				background: transparent;
			}
		}
	}
	
</style>
