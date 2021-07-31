<template>
	<view class="content">
		<view class="goods-list">
			<view 
				v-for="(item, index) in SearchGoodsList" :key="index"
				class="goods-item"
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
		<view v-show="isLoadMore" style="width: 100%;display: flex;justify-content: center;">
			<!-- loading加载提示处 -->
			<uni-load-more :status="loadStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	const SearchGoodsList = []
	export default {
		components: {
			uniLoadMore	
		},
		data() {
			return {
				SearchGoodsList: [],
				params: {
					page: 1,
					limit: 10,
					keyword:'',
				},
				loadStatus: 'loading', //加载样式：more-加载前样式，loading-加载中样式，nomore-没有数据样式
				isLoadMore: false, //是否加载中
			};
		},
		onPageScroll(e){
			//兼容iOS端下拉时顶部漂移
			if(e.scrollTop>=0){
				this.headerPosition = "fixed";
			}else{
				this.headerPosition = "absolute";
			}
		},
		onLoad(options){
			this.params.keyword = options.keyword;
			this.detailList()
		},
		onPullDownRefresh() {
			// 清空数据
			this.SearchGoodsList = []
			// 开始获取数据
			this.detailList()
			setTimeout(function() {
				uni.stopPullDownRefresh(); //停止下拉刷新动画
			}, 1000);
		},
		onReachBottom() {
			if (!this.isLoadMore) { //此处判断，上锁，防止重复请求
				this.isLoadMore = true
				this.params.page += 1     //上拉加载后端给的是要求分页去做，每页十个，所以上拉的时候page+1即可
				this.detailList()
			}
		},
		methods: {
			//加载商品 ，带下拉刷新和上滑加载
			detailList(){   
				uni.request({
					url:'https://hm.zhugokeji.com/index.php/api/api/query_good',
					data:this.params,
					dataType: 'json',
					success:res => {
						if (res.statusCode < 400) {
							if(res.data.code == 0){
								this.SearchGoodsList = this.SearchGoodsList.concat(res.data.data)  //这个是用来数据连接的
								if (res.data.data.length < this.params.limit) { //判断接口返回数据量小于请求数据量，则表示此为最后一页
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
			//详情
			navToDetailPage(item){
				//测试数据没有写id，用title代替
				let id = item.id;
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
			stopPrevent(){}
		},
	}
</script>

<style lang="scss">
	page, .content{
		background: $page-color-base;
	}
	
	/* 商品列表 */
	.goods-list{
		display:flex;
		flex-wrap:wrap;
		padding: 0 30upx;
		.goods-item{
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
	}
</style>
