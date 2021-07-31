<template>
	<view class="container">
		<!-- 搜索 -->
		<uni-search-bar @confirm="search" :focus="false" v-model="searchValue" @blur="blur" @focus="focus" @input="input" @cancel="cancel" @change="change" @clear="clear">
		</uni-search-bar>
		<!-- 头部轮播 -->
		<view class="carousel-section">
			<swiper class="carousel" circular >
				<swiper-item v-for="(item, index) in carouselList" :key="index" class="carousel-item">
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
		</view>
		<view v-show="isLoadMore" style="width: 100%;display: flex;justify-content: center;">
				<!-- loading加载提示处 -->
				<uni-load-more :status="loadStatus"></uni-load-more>
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
				params: {
					page: 1,
					limit: 10,
				},
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
				carouselList: [],
				indexCateList:[],
				indexGoodsList: [],
				searchValue:'',
				total:0
			};
		},
		onLoad(options){
			// #ifdef H5
			this.headerTop = document.getElementsByTagName('uni-page-head')[0].offsetHeight+'px';
			// #endif
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
		onPullDownRefresh() {
			// 清空数据
			this.carouselList = [];
			this.indexCateList = [];
			this.indexGoodsList = [];
			// 开始获取数据
			this.loadData()
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 1000);
		},
		onReachBottom() {
			if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
				this.isLoadMore = true
				this.params.page += 1     //上拉加载后端给的是要求分页去做，每页十个，所以上拉的时候page+1即可
				this.loadData()
			}
		},
		methods: {
			//加载商品 ，带下拉刷新和上滑加载
			loadData(){  
				//轮播图
				uni.request({
                    url: "https://hm.zhugokeji.com/index.php/api/api/index_banner",                  
                    method: 'get',
                    dataType: 'json',
					success: res => {
						this.carouselList= res.data.data;
					}
				})
				//分类
				uni.request({
                    url: "https://hm.zhugokeji.com/index.php/api/api/index_type",                  
                    method: 'get',
                    dataType: 'json',
					success: res => {
						console.log(res.data.data)
						this.indexCateList=res.data.data;
					}
				}) 
				uni.request({
					url:'https://hm.zhugokeji.com/index.php/api/api/index_good',
					data:this.params,
					dataType: 'json',
					success:res => {
						if (res.statusCode < 400) {
							if(res.data.code == 0){
								this.indexGoodsList = this.indexGoodsList.concat(res.data.data.data)  //这个是用来数据连接的
								if (res.data.data.data.length < this.params.limit) { //判断接口返回数据量小于请求数据量，则表示此为最后一页
									this.isLoadMore = true
									this.loadStatus = 'nomore'
								} else {
									this.isLoadMore = false
								}
							}else{
								this.isLoadMore = true
								this.loadStatus = 'nomore'
							}
						} else {
							this.$api.msg(res.data.message)
						}
					}
				})
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
				if(res != ''){
					uni.navigateTo({
						url: `/pages/searchList/searchList?keyword=${res.value}`
					})
				}
				
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
