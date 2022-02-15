import React, { useCallback, useEffect, useState } from 'react'
import Icon from 'react-icons-kit'
import { Link, useHistory } from 'react-router-dom'
import { plus, eye, edit2, trash2, eyeOff, x } from 'react-icons-kit/feather'
import { CustomButton } from '../../components/button'
import { DataTable } from '../../components/table/Index'
import { dateFormate } from '../../utils/Helpers'
import { DeleteModal } from '../../components/modal/Delete'
import { Container } from '../../components/container'
import { Card } from '../../components/card/Index'
import { SingleSelect } from '../../components/select'
import { useQuery } from '../../components/query/Index'
import Requests from '../../utils/Requests/Index'
const Index = () => {
  const history = useHistory()
  const queryParams = useQuery()
  const [isLoading, setLoading] = useState(true)
  const [limit, setLimit] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [data, setData] = useState([])
  const [searchLoading, setsearchLoading] = useState(false)
  const [closeFilter, setCloseFilter] = useState(false)
  const [isDelete, setDelete] = useState({ value: null, show: false, loading: false })
  const BASE_URL = "https://campaign.api.eazybest.com/uploads/campaign/sm/"
  /* fetch data */
  const fetchData = useCallback(async (query) => {
    setLoading(true)
    const response = await Requests.Services.Campaign.Index(query)
    if (response && response.status === 200) {
      setData(response.data.data)
      setTotalItems(response.data.pagination ? response.data.pagination.items : 0)
    }
    setLoading(false)
  }, [limit])
  /* handle page change */
  const handlePageChange = page => fetchData({ page })
  /* handle limit change */
  const handleLimitChange = async (newLimit, page) => {
    setLoading(true)
    const response = await Requests.Services.Campaign.Index({ page: page, limit: newLimit })
    setData(response.data.data)
    setLimit(newLimit)
    setLoading(false)
  }
  useEffect(() => {
    if (queryParams) {
      let params = { ...queryParams }
      params.page = queryParams.page || 1
      params.limit = queryParams.limit || 10
      const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
      fetchData(queryString)
      setCloseFilter(true)
    }
  }, [
    queryParams.limit,
    queryParams.page,
    queryParams.assign_to,
    queryParams.start_from_date,
    queryParams.end_to_date,
    fetchData
  ])
  /* handle search */
  const handleSearch = async data => {
    setsearchLoading(true)
    const response = await Requests.Services.Campaign.Search({ title: data })
    if (response) setData(response.data.data)
    setsearchLoading(false)
  }
  /* handle search suggestion */
  const handleSuggestion = async (value) => {
    let data = {
      results: [],
      message: null
    }
    const response = await Requests.Services.Campaign.Search({ title: value })
    if (response && response.status === 200 && response.data.data && response.data.data.length) {
      for (let i = 0; i < response.data.data.length; i++) {
        const element = response.data.data[i]
        data.results.push(element.title)
      }
    } else {
      data.message = "No results found"
    }
    return data
  }
  /* handle filter by URL params */
  const handleFilterByUrl = (field, value) => {
    let item = { [field]: value }
    let params = {
      ...queryParams,
      ...item,
      page: queryParams.page || 1,
      limit: queryParams.limit || 10
    }
    const queryString = Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
    history.replace(`/dashboard/campaign?${queryString}`)
    setCloseFilter(true)
  }
  /* data column */
  const columns = [
    {
      name: 'Image',
      grow: 0,
      cell: row => <img height={40} alt={"Campaign"} src={BASE_URL + row.banner_sm} />
    },
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true
    },
    {
      name: 'Type',
      grow: 0,
      selector: row => row.discount_type,
      sortable: true
    },
    {
      name: 'Amount',
      grow: 0,
      selector: row => row.discount_amount,
      sortable: true
    },
    {
      name: 'Assign To',
      grow: 0,
      selector: row => row.assign_to,
      sortable: true
    },
    {
      name: 'Start Date',
      grow: 1,
      selector: row => dateFormate(row.start_from_date),
      sortable: true
    },
    {
      name: 'End Date',
      grow: 1,
      selector: row => dateFormate(row.end_to_date),
      sortable: true
    },
    {
      name: 'Published',
      grow: 0,
      selector: row => row.is_active,
      sortable: true,
      cell: row =>
        <div>
          {row.is_active ?
            <Icon icon={eye} size={15} className="text-success" /> :
            <Icon icon={eyeOff} size={15} className="text-muted" />
          }
        </div>
    },
    {
      name: 'Action',
      grow: 0,
      minWidth: '150px',
      cell: row =>
        <div>
          <Link to={`/dashboard/campaign/${row._id}/show`}>
            <CustomButton
              style={{ padding: "6px 10px" }}
              className="btn-success rounded-circle border-0 mr-1"
            ><Icon icon={eye} size={16} />
            </CustomButton>
          </Link>
          <Link to={`/dashboard/campaign/${row._id}/edit`}>
            <CustomButton
              style={{ padding: "6px 10px" }}
              className="btn-success rounded-circle border-0 mr-1"
            ><Icon icon={edit2} size={16} />
            </CustomButton>
          </Link>
          <CustomButton
            style={{ padding: "6px 10px" }}
            className="btn-danger rounded-circle border-0"
            onClick={() => setDelete({ value: row, show: true })}
          ><Icon icon={trash2} size={16} />
          </CustomButton>
        </div>
    }
  ]
  /* handle delete */
  const handleDelete = async () => {
    setDelete({ ...isDelete, loading: true })
    await Requests.Services.Campaign.Delete(isDelete.value._id)
    fetchData()
    setDelete({ ...isDelete, show: false, loading: false })
  }
  return (
    <div className="pb-4">
      <Container.Fluid>
        <Container.Row>
          <Container.Column className="col-padding">
            <Card.Simple className="border-0">
              <Card.Header className="bg-white border-0 px-3 px-lg-4">
                {/* title container */}
                <div className="d-flex">
                  <div><h6 className="mb-0">Campaign List</h6></div>
                  <div className="ml-auto">
                    <Link to="/dashboard/campaign/create">
                      <CustomButton className="btn-primary border-0 rounded-circle circle__padding">
                        <Icon icon={plus} size={22} />
                      </CustomButton>
                    </Link>
                    {closeFilter ?
                      <CustomButton
                        className="btn-danger border-0 rounded-circle circle__padding ml-1"
                        onClick={() => {
                          setCloseFilter(false)
                          history.push(`/dashboard/campaign`)
                        }}
                      >
                        <Icon icon={x} size={22} />
                      </CustomButton>
                      : null
                    }
                  </div>
                </div>
                {/* Filter items */}
                <Container.Row className="pt-2 px-2">
                  {/* Assign To */}
                  <Container.Column className="col-sm-4 px-1 mb-2">
                    <SingleSelect
                      placeholder="Assign To"
                      borderRadius={25}
                      defaultValue={{ label: null, value: null }}
                      options={[
                        { label: "Brand", value: "Brand" },
                        { label: "Vendor", value: "Vendor" },
                        { label: "Category", value: "Category" },
                        { label: "Sub category", value: "Sub-category" },
                        { label: "Leaf category", value: "Leaf-category" },
                        { label: "Vendor", value: "Vendor" },
                        { label: "Product", value: "Product" }
                      ]}
                      value={event => handleFilterByUrl("assign_to", event.value)}
                    />
                  </Container.Column>
                  {/* Date range filter */}
                  <Container.Column className="col-sm-4 px-1 mb-2">
                    <div className="form-group mb-0">
                      <input
                        type="date"
                        className="form-control shadow-none"
                        style={{ borderRadius: 25, fontSize: 14, minHeight: 42 }}
                        onChange={event => handleFilterByUrl("start_from_date", event.target.value)}
                      />
                    </div>
                  </Container.Column>
                  <Container.Column className="col-sm-4 px-1 mb-2">
                    <div className="form-group mb-0">
                      <input
                        type="date"
                        className="form-control shadow-none"
                        style={{ borderRadius: 25, fontSize: 14, minHeight: 42 }}
                        onChange={event => handleFilterByUrl("end_to_date", event.target.value)}
                      />
                    </div>
                  </Container.Column>
                </Container.Row>
              </Card.Header>
              <Card.Body className="p-0">
                <DataTable
                  fixedHeader
                  fixedHeaderScrollHeight="580px"
                  columns={columns}
                  data={data}
                  loading={isLoading}
                  totalRows={totalItems}
                  pagination={true}
                  paginationServer={true}
                  handlePerRowsChange={handleLimitChange}
                  handlePageChange={handlePageChange}
                  searchable
                  placeholder={"Search campaign"}
                  search={handleSearch}
                  suggestion={handleSuggestion}
                  searchLoading={searchLoading}
                  clearSearch={() => fetchData({ page: 1, limit: 10 })}
                />
              </Card.Body>
            </Card.Simple>
          </Container.Column>
        </Container.Row>
      </Container.Fluid>
      {/* Delete confirmation */}
      <DeleteModal
        show={isDelete.show}
        loading={isDelete.loading}
        message={
          <div>
            <h6>Want to delete this Campaign ?</h6>
            <img src={isDelete.value ? isDelete.value.image : null} className="img-fluid" height={150} alt="Campaign" />
          </div>
        }
        onHide={() => setDelete({ value: null, show: false, loading: false })}
        doDelete={handleDelete}
      />
    </div>
  );
}
export default Index;