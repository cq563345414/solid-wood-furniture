<<template>
	<view class="content">
		<scroll-view scroll-with-animation scroll-y class="right-aside">
			<view class="s-list">
				<view class="t-list">
					<view @click="navToList(item.id)" class="t-item" v-for="item in cateList">
						<text>{{item.typename}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				sizeCalcState: false,
				tabScrollTop: 0,
				currentId: 1,
				cateList: [],
			}
		},
		onLoad(){
			this.loadData();
		},
		methods: {
			loadData(){
				//所有分类
				uni.request({
					url: "https://hm.zhugokeji.com/index.php/api/api/type",                  
					method: 'get',
					dataType: 'json',
					success: res => {
						this.cateList=res.data.data;
					}
				})
			},
			navToList(id){
				uni.navigateTo({
					url: `/pages/product/list?id=${id}`
				})
			}
		}
	}
</script>

<style lang='scss'>
	page,
	.content {
		height: 100%;
	}

	.content {
		display: flex;
	}
	.right-aside{
		flex: 1;
		overflow: hidden;
	}
	.t-list{
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		background: #fff;
		padding-top: 12upx;
		&:after{
			content: '';
			flex: 99;
			height: 0;
		}
	}
	.t-item{
		flex-shrink: 0;
		display: flex;
		justify-content: center;
		align-items: left;
		flex-direction: column;
		width: 345upx;
		margin-top:20upx;
		margin-left:20upx;
		font-size: 26upx;
		color: #666;
		background:#eee;
		padding: 20upx 0 20upx 30upx;
		border-radius: 10upx;
	}
</style>