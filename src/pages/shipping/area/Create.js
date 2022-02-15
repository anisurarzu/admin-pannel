import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from 'react-icons-kit'
import { Container } from '../../../components/container';
import { Card } from '../../../components/card/Index';
import { Text } from '../../../components/text';
import { CustomButton } from '../../../components/button';
import { chevronLeft } from 'react-icons-kit/feather';
import { AreaForm } from '../../../components/form/AreaForm';
import Requests from '../../../utils/Requests/Index';


const Create = () => {
  const [loading, setLoading] = useState(false)
  const [header] = useState({
    headers: { Authorization: "Bearer " + localStorage.getItem('token') }
  })
  // const history = useHistory();

  // handle Area create
  const handleAreaCreate = async (data) => {
    setLoading(true)
    await Requests.Services.Shipping.Area.Store(data, header);
    setLoading(false)
  }
  return (
    <div className='pb-4'>
      <Container.Fluid>
        <Container.Row>
          <Container.Column className="col-padding">
            <Card.Simple className="border-0 shadow-sm">
              <Card.Header className="p-3 p-lg-4 bg-white">
                <div className="d-flex">
                  <div>
                    <Text className="fs-16 mt-2 mb-0">Create Area</Text>
                  </div>
                  <div className="ml-auto pt-2">
                    <Link to="/dashboard/shipping/area">
                      <CustomButton className="btn-primary rounded-circle border-0 circle__padding">
                        <Icon icon={chevronLeft} size={20} />
                      </CustomButton>
                    </Link>
                  </div>
                </div>
              </Card.Header>

              <Card.Body className="p-4">
                {/* Area Form */}
                <AreaForm
                  loading={loading}
                  submit={handleAreaCreate}
                />
              </Card.Body>
            </Card.Simple>
          </Container.Column>
        </Container.Row>
      </Container.Fluid>
    </div>
  );
}

export default Create;