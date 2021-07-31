<template>
	<view class="container">
		<!-- 搜索 -->
		<uni-search-bar @confirm="search" :focus="false" v-model="searchValue" @blur="blur" @focus="focus" @input="input" @cancel="cancel" @change="change" @clear="clear">
		</uni-search-bar>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper class="carousel" circular >
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item" @click="navToDetailPage({title: '轮播广告'})">
					<image :src="item.url" />
				</swiper-item>
			</swiper>
		</view>
		<!-- 分类 -->
		<view class="cate-section">
			<view class="cate-item" @click="navToList(item.id)" v-for="(item,index) in indexCateList" :key="index">
				<image :src="item.url"></image>
				<text>{{item.typename}}</text>
			</view>
		</view>
		<view class="content">
			<view class="guess-section">
				<view 
					v-for="(item, index) in indexGoodsList" :key="index"
					class="guess-item"
					@click="navToDetailPage(item.aid)"
				>
					<view class="image-wrapper">
						<image :src="item.url" mode="aspectFill"></image>
					</view>
					<text class="title clamp">{{item.title}}</text>
					<view class="price-box">
						<text>{{item.count}}张图片</text>
					</view>
				</view>
			</view>
			<uni-load-more :status="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	const indexGoodsList = []
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				headerPosition:"fixed",
				headerTop:"0px",
				loadingType: 'more', //加载更多状态
				filterIndex: 0, 
				carouselList: [],
				indexGoodsList: [],
				indexCateList:[],
				searchValue:'',
				total:0
			};
		},
		onLoad(options){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
			this.loadIndexData();
			this.loadData();
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		//下拉刷新
		onPullDownRefresh(){
			this.loadData('refresh');
		},
		//加载更多
		onReachBottom(){
			this.loadData('more');
		},
		methods: {
			async loadIndexData(){
				//轮播图
				await this.$axios.get('/index_banner')
				.then((res)=>{
					this.carouselList=res.data.data;
				}).catch((res)=>{
					console.log(res);
				}),
				//分类
				await this.$axios.get('/index_type')
				.then((res)=>{
					this.indexCateList=res.data.data;
				}).catch((res)=>{
					console.log(res);
				})
			},
			//加载商品 ，带下拉刷新和上滑加载
			async loadData(type='add', loading) {
				//产品
				await this.$axios.get('/index_good')
				.then((res)=>{
					if(res.data.code == 0){
						this.indexGoodsList=res.data.data.data;
						this.total = res.data.data.total
					}else{
						uni.showToast({
							title: res.data,
							icon: 'none'
						})
					}
				}).catch((res)=>{
				})
				//没有更多直接返回
				if(type === 'add'){
					if(this.loadingType === 'nomore'){
						return;
					}
					this.loadingType = 'loading';
				}else{
					this.loadingType = 'more'
				}
				//筛选，测试数据直接前端筛选了
				if(this.filterIndex === 1){
					indexGoodsList.sort((a,b)=>b.sales - a.sales)
				}
				if(this.filterIndex === 2){
					indexGoodsList.sort((a,b)=>{
						if(this.priceOrder == 1){
							return a.price - b.price;
						}
						return b.price - a.price;
					})
				}
				this.indexGoodsList = this.indexGoodsList.concat(indexGoodsList);
				//判断是否还有下一页，有是more  没有是nomore(测试数据判断大于20就没有了)
				this.loadingType  = this.indexGoodsList.length >= this.total ? 'nomore' : 'more';
				if(type === 'refresh'){
					if(loading == 1){
						uni.hideLoading()
					}else{
						uni.stopPullDownRefresh();
					}
				}
			},
			//详情页
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			navToList(id){
				uni.navigateTo({
					url: `/pages/product/list?id=${id}`
				})
			},
			// 搜索
			search(res) {
				uni.navigateTo({
					url: `/pages/searchList/searchList?keywodr=${res.value}`
				})
			},
			input(res) {
			},
			clear(res) {
			},
			blur(res) {
			},
			focus(e) {
			},
			cancel(res) {
			}
		},
	}
</script>

<style lang="scss">
	/* #ifdef MP */
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #fff;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;

		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 44px;
			box-sizing: content-box;
		}
	}
	.carousel {
		width: 100%;
		height: 350upx;

		.carousel-item {
			width: 100%;
			height: 100%;
			padding: 0 28upx;
			overflow: hidden;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10upx;
		}
	}
	/* 分类 */
	.cate-section {
		display: flex;
		justify-content: space-around;
		align-items: center;
		flex-wrap:wrap;
		padding: 30upx 22upx; 
		background: #fff;
		.cate-item {
			display: flex;
			width: 20%;
			flex-direction: column;
			align-items: center;
			font-size: $font-sm + 2upx;
			color: $font-color-dark;
		}
		/* 原图标颜色太深,不想改图了,所以加了透明度 */
		image {
			width: 88upx;
			height: 88upx;
			margin-bottom: 14upx;
			border-radius: 50%;
			opacity: .7;
			box-shadow: 4upx 4upx 20upx rgba(250, 67, 106, 0.3);
		}
	}
	
	/* 猜你喜欢 */
	.guess-section{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		background: #fff;
		.guess-item{
			display:flex;
			flex-direction: column;
			width: 48%;
			padding-bottom: 40upx;
			&:nth-child(2n+1){
				margin-right: 4%;
			}
		}
		.image-wrapper{
			width: 100%;
			height: 330upx;
			border-radius: 3px;
			overflow: hidden;
			image{
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		.title{
			font-size: $font-lg;
			color: $font-color-dark;
			line-height: 80upx;
		}
		.price-box{
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding-right: 10upx;
			font-size: 24upx;
			color: $font-color-light;
		}
		.price{
			font-size: $font-lg;
			color: $uni-color-primary;
			line-height: 1;
		}
	}
	

</style>
