


export class ApiFeatures {
    constructor(mongooseQuery, searchQuery) {
        this.mongooseQuery = mongooseQuery
        this.searchQuery = searchQuery
    }

    async pagination(model) {
        let pageNumber = this.searchQuery.page * 1 || 1
        if (this.searchQuery.page < 1) pageNumber = 1
        const limit = this.searchQuery.limit * 1 || 2;
        this.pageNumber = pageNumber
        this.limit = limit
        this.total = await model.countDocuments()
        this.totalPages = Math.ceil(this.total / limit)
        this.nextPage = pageNumber < this.totalPages ? pageNumber + 1 : null;
        this.prevPage = pageNumber > 1 ? pageNumber - 1 : null;
        const skip = (pageNumber - 1) * limit
        this.mongooseQuery.skip(skip).limit(limit)
        return this
    }

    filter() {
        let filterObj = structuredClone(this.searchQuery)
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/(gt|gte|lt|lte)/g, value => `$${value}`)
        filterObj = JSON.parse(filterObj)
        let excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(field => delete filterObj[field])
        this.mongooseQuery.find(filterObj)
        return this
    }

    sort() {
        if (this.searchQuery.sort) {
            let sortedBy = this.searchQuery.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this
    }

    fields() {
        if (this.searchQuery.fields) {
            let fields = this.searchQuery.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
        }
        return this
    }

    search() {
        if (this.searchQuery.search) {
            this.mongooseQuery.find(
                {
                    $or: [
                        { title: { $regex: this.searchQuery.search, $options: 'i' } },
                        { description: { $regex: this.searchQuery.search, $options: 'i' } },
                        { name: { $regex: this.searchQuery.search, $options: 'i' } },
                        { slug: { $regex: this.searchQuery.search, $options: 'i' } }
                    ]
                }
            )
        }
        return this
    }

}