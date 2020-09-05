import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { TwitterPicker } from 'react-color';
import { AiOutlineQrcode } from 'react-icons/ai';
import { FiCheck } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from 'react-loader-spinner';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';

function App() {
  const [qrCodes, setQrCodes] = useState([]);
  const [mainColor, setMainColor] = useState('#FF6900');
  const [fillColor, setFillColor] = useState('#f8f8f8');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQrPng, setGeneratedQrPng] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    axios.get('http://localhost:9292/all_qr_codes')
    .then((res) => setQrCodes(res.data))
    .catch((err) => console.log(err));
  }, []);
  
  const notifySuccess = () => {
    toast.success("🤩 QR Code Generated!", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  const notifyWarning = () => {
    toast.warn("Please enter all details", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  const notifyError = () => {
    toast.error("Something ain't working", {
      position: toast.POSITION.TOP_RIGHT
    });
  }

  function renderQrCodes() {
    if (qrCodes.length > 0) {
      return qrCodes.map((code) => (
        <Col sm={4} key={code.created_at} className="mb-5">
          <Card>
            <Card.Img variant="top" src={code.image} />
            <Card.Body>
              <Card.Title>{code.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{code.description}</Card.Subtitle>
              <Card.Text>{moment(code.created_at).format('MMMM Do YYYY, h:mm:ss a')}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))
    }
  }
  
  return (
    <>
      <ToastContainer autoClose={4000} />

      <Navbar bg="light">
        <Navbar.Brand><AiOutlineQrcode /><strong>QR Code</strong> Generator</Navbar.Brand>
      </Navbar>

      <Jumbotron fluid>
        <div className="text-center">
          <h1><span role="img" aria-label="Badass emoji">🤩</span> Free QR Code Generator</h1>
          <p>
            Generate a QR code for your LinkedIn profile, website, Facebook page, or any other URL.
          </p>
        </div>
      </Jumbotron>

      <div className="container mb-5">
        <div className="row mb-3">
          <div className="col-md-12">
            <div className="card shadow">
              <div className="card-header">
                Create your QR code
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-8">

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <p className="lead">Pick qr code color</p>
                        <div 
                          style={{
                            width: 276, 
                            height: 50,
                            backgroundColor: mainColor
                          }}
                        />

                        <TwitterPicker 
                          color={mainColor}
                          onChange={(color, event) => setMainColor(color.hex)}
                        />

                        <hr />

                        <p className="lead">Pick background color</p>

                        <div 
                          style={{
                            width: 276, 
                            height: 50,
                            backgroundColor: fillColor
                          }}
                        />
                        <TwitterPicker 
                          color={fillColor}
                          onChange={(color, event) => setFillColor(color.hex)}
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <p className="lead">Add your information</p>

                        <form>
                          <div className="form-group">
                            <input 
                              name="name"
                              type="text"
                              placeholder="Your name"
                              className="form-control"
                              onChange={(event) => setName(event.target.value)}
                              value={name}
                            />
                          </div>
                          
                          <div className="form-group">
                            <input 
                              name="description"
                              type="text"
                              placeholder="Enter description"
                              className="form-control"
                              onChange={(event) => setDescription(event.target.value)}
                              value={description}
                            />
                          </div>

                          <div className="form-group">
                            <input 
                              name="url"
                              type="text"
                              placeholder="Enter URL"
                              className="form-control"
                              onChange={(event) => setUrl(event.target.value)}
                              value={url}
                            />
                          </div>
                        </form>

                        <hr />

                        <button 
                          className="btn btn-success btn-lg btn-block"
                          disabled={isLoading}
                          onClick={() => {
                            setIsLoading(true);

                            if (!name || !description || !url) {
                              notifyWarning();
                              setIsLoading(false);

                              return;
                            }

                            axios.post('http://localhost:9292/create_qr_code', {
                              name: name,
                              description: description,
                              main_color: mainColor,
                              fill_color: fillColor,
                              url: url
                            }, 
                            {
                              headers: {
                                'Content-Type': 'application/json'
                              }
                            })
                            .then((res) => {
                              console.log(res.data);
                              setQrCodes(res.data.all_qr_codes);
                              setGeneratedQrPng(res.data.generated_qr_png);
                              setIsLoading(false);
                              notifySuccess();
                            })
                            .catch((err) => {
                              console.log(err);
                              setIsLoading(false);
                              notifyError();
                            });
                          }}
                        >
                          <FiCheck /> Save QR code
                        </button>
                      </div>
                    </div>
                  </div>

                  {
                    generatedQrPng ? (
                      <div className="col-md-4">
                        <p className="lead">Your QR Code</p>
                        
                        <img src={generatedQrPng} className="img-fluid" alt="Generated QR Code" />
                      </div>
                    ) : (
                      <div className="col-md-4">
                        <p className="lead">QR code preview</p>
                        {
                          isLoading ? (
                            <Loader
                              visible={isLoading}
                              type="Bars" 
                              color="#00BFFF" 
                              height={80} 
                              width={80}
                            />
                          ) : (
                            // <img src={previewPng} className="img-fluid" />
                            <div className="card" style={{backgroundColor: fillColor}}>
                              <div className="card-body">
                                <div style={{padding: 100, backgroundColor: fillColor, border: `10px solid ${mainColor}`, justifyContent: 'center'}}>
                                  <div style={{width: 20, height: 20, backgroundColor: mainColor}}>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    )
                  }

                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Container>
        <Row>
          {renderQrCodes()}
        </Row>
      </Container>
    </>
  );
}

export default App;
