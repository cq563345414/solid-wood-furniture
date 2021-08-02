<template>
	<view class="container">
		
		<view class="c-list">
			<view class="c-row b-b">
				<view class="con-list">
					<text class="title">{{title}}</text>
					<text>{{description}}</text>
				</view>
			</view>
		</view>
		<view class="detail-desc">
			<view class="d-header">
				<text>详情图</text>
				<view class="d-choose" @click="switchImgWidth()">
					<text>{{imgText}}</text>
				</view>
			</view>
			<view class="d-content">
				<img v-for="(item,index) in imgList" @click="previewImage(index)" :style="{float:'left',width:imgWidth+'%',}" mode="widthFix" :src="item.url" alt="" :key="index" >
			</view>
		</view>
		
		<!-- 底部操作菜单 -->
		<view class="page-bottom">
			<navigator url="/pages/index/index" open-type="switchTab" class="p-b-btn">
				<text class="yticon icon-xiatubiao--copy"></text>
				<text>首页</text>
			</navigator>
			<view style="background-color: rgb(245 208 104);color:#fff;" @click="toImgDow()" class="p-b-btn">
				<text class="yticon icon-xia" style="color:#fff;"></text>
				<text>下载</text>
			</view>
			<view class="p-b-btn" style="background-color: #DD524D; color:#fff;" @click="share">
				<text class="yticon icon-share" style="color:#fff;"></text>
				<text>分享</text>
			</view>
		</view>
		<!-- 分享 -->
		<share ref="share" :contentHeight="170" :shareList="shareList"></share>
	</view>
</template>

<script>
	import share from '@/components/share';
	export default{
		components: {
			share,
		},
		data() {
			return {
				favorite: true,
				shareList: [],
				title:'标题',
				description: "内容",
				imgText:'大图',
				imgWidth:100,
				imgList: [],
				did:-1,
			};
		},
		async onLoad(options){
			//接收传值,id里面放的是标题，因为测试数据并没写id 
			this.did = options.id;
			await uni.request({
				url: "https://hm.zhugokeji.com/index.php/api/api/good_datail",
				method: 'GET',
				data: {
					'aid':this.did,
				},
				dataType: 'json',
				success: res => {
					this.title=res.data.data.title;
					this.description=res.data.data.seo_description;
					this.imgList=res.data.data;
				}
			});
			// this.shareList = await this.$api.json('shareList')
		},
		methods:{
			toImgDow(){
				if(this.imgList.length > 0){
					uni.navigateTo({
						url: `/pages/imgdow/imgdow?id=${this.did}`
					})
				}else{
					 uni.showToast({title:"暂无图片", icon:"none"});
				}
			},
			//图片大小切换
			switchImgWidth(){
				if(this.imgWidth == 100){
					this.imgWidth = 50;
					this.imgText = '中图';
				}else if(this.imgWidth == 50){
					this.imgWidth = 25;
					this.imgText = '小图';
				}else{
					this.imgWidth = 100;
					this.imgText = '大图';
				}
			},
			// 预览图片
			previewImage(index) {
				let photoList = this.imgList.map(item => {
					return item.src;
				});
				uni.previewImage({
					current: index,     // 当前显示图片的链接/索引值
					urls: photoList,    // 需要预览的图片链接列表，photoList要求必须是数组
					loop:true   // 是否可循环预览
				});
			},
			//分享
			share(){
				this.$refs.share.toggleMask();	
			},
			stopPrevent(){}
		},
		onShareAppMessage(res) {
		    return {
		      title: '实木家具',
		      path: '/pages/index/index'
		    }
		}
	}
</script>

<style lang='scss'>
	page{
		background: $page-color-base;
		padding-bottom: 160upx;
	}
	.icon-you{
		font-size: $font-base + 2upx;
		color: #888;
	}
	.carousel{
		height: 722upx;
		position:relative;
		swiper{
			height: 100%;
		}
		.image-wrapper{
			width: 100%;
			height: 100%;
		}
		.swiper-item {
			display: flex;
			justify-content: center;
			align-content: center;
			height: 750upx;
			overflow: hidden;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
	/* 分享 */
	.share-section{
		display:flex;
		align-items:center;
		color: $font-color-base;
		background: linear-gradient(left, #fdf5f6, #fbebf6);
		padding: 12upx 30upx;
		.share-icon{
			display:flex;
			align-items:center;
			width: 70upx;
			height: 30upx;
			line-height: 1;
			border: 1px solid $uni-color-primary;
			border-radius: 4upx;
			position:relative;
			overflow: hidden;
			font-size: 22upx;
			color: $uni-color-primary;
			&:after{
				content: '';
				width: 50upx;
				height: 50upx;
				border-radius: 50%;
				left: -20upx;
				top: -12upx;
				position:absolute;
				background: $uni-color-primary;
			}
		}
		.icon-xingxing{
			position:relative;
			z-index: 1;
			font-size: 24upx;
			margin-left: 2upx;
			margin-right: 10upx;
			color: #fff;
			line-height: 1;
		}
		.tit{
			font-size: $font-base;
			margin-left:10upx;
		}
		.icon-bangzhu1{
			padding: 10upx;
			font-size: 30upx;
			line-height: 1;
		}
		.share-btn{
			flex: 1;
			text-align:right;
			font-size: $font-sm;
			color: $uni-color-primary;
		}
		.icon-you{
			font-size: $font-sm;
			margin-left: 4upx;
			color: $uni-color-primary;
		}
	}
	
	.c-list{
		font-size: $font-sm + 2upx;
		color: $font-color-base;
		background: #fff;
		.title{
			font-size: 32upx;
			color: $font-color-dark;
			height: 50upx;
			line-height: 50upx;
		}
		.c-row{
			display:flex;
			align-items:center;
			padding: 20upx 30upx;
			position:relative;
		}
		.tit{
			width: 140upx;
		}
		.con{
			flex: 1;
			color: $font-color-dark;
			.selected-text{
				margin-right: 10upx;
			}
		}
		.bz-list{
			height: 40upx;
			font-size: $font-sm+2upx;
			color: $font-color-dark;
			text{
				display: inline-block;
				margin-right: 30upx;
			}
		}
		.con-list{
			flex: 1;
			display:flex;
			flex-direction: column;
			color: $font-color-dark;
			line-height: 40upx;
		}
		.red{
			color: $uni-color-primary;
		}
	}
	/*  详情 */
	.detail-desc{
		background: #fff;
		margin-top: 16upx;
		.d-header{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 80upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			position: relative;
			text{
				padding: 0 20upx;
				background: #fff;
				position: relative;
				z-index: 1;
			}
			&:after{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%);
				width: 300upx;
				height: 0;
				content: '';
				border-bottom: 1px solid #ccc; 
			}
			.d-choose{
				position: absolute;
				right: 0%;
				font-size: $font-base;
				color:#888;
			}
		}
	}
	/*  弹出层 */
	.popup {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		
		&.show {
			display: block;
			.mask{
				animation: showPopup 0.2s linear both;
			}
			.layer {
				animation: showLayer 0.2s linear both;
			}
		}
		&.hide {
			.mask{
				animation: hidePopup 0.2s linear both;
			}
			.layer {
				animation: hideLayer 0.2s linear both;
			}
		}
		&.none {
			display: none;
		}
		.mask{
			position: fixed;
			top: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
			background-color: rgba(0, 0, 0, 0.4);
		}
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			.btn{
				height: 66upx;
				line-height: 66upx;
				border-radius: 100upx;
				background: $uni-color-primary;
				font-size: $font-base + 2upx;
				color: #fff;
				margin: 30upx auto 20upx;
			}
		}
		@keyframes showPopup {
			0% {
				opacity: 0;
			}
			100% {
				opacity: 1;
			}
		}
		@keyframes hidePopup {
			0% {
				opacity: 1;
			}
			100% {
				opacity: 0;
			}
		}
		@keyframes showLayer {
			0% {
				transform: translateY(120%);
			}
			100% {
				transform: translateY(0%);
			}
		}
		@keyframes hideLayer {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(120%);
			}
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
			color: $font-color-base;
			width: 33.3333%;
			height: 92upx;
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
